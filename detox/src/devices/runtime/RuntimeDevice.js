const DetoxRuntimeError = require('../../errors/DetoxRuntimeError');
const debug = require('../../utils/debug'); // debug utils, leave here even if unused
const { traceCall } = require('../../utils/trace');
const wrapWithStackTraceCutter = require('../../utils/wrapWithStackTraceCutter');

const LaunchArgsEditor = require('./utils/LaunchArgsEditor');

class RuntimeDevice {
  constructor({
    appsConfig,
    behaviorConfig,
    deviceConfig,
    eventEmitter,
    sessionConfig,
    runtimeErrorComposer,
  }, deviceDriver) {
    wrapWithStackTraceCutter(this, [
      'captureViewHierarchy',
      'clearKeychain',
      'disableSynchronization',
      'enableSynchronization',
      'installApp',
      'launchApp',
      'matchFace',
      'matchFinger',
      'openURL',
      'pressBack',
      'relaunchApp',
      'reloadReactNative',
      'resetContentAndSettings',
      'resetStatusBar',
      'reverseTcpPort',
      'selectApp',
      'sendToHome',
      'sendUserActivity',
      'sendUserNotification',
      'setBiometricEnrollment',
      'setLocation',
      'setOrientation',
      'setStatusBar',
      'setURLBlacklist',
      'shake',
      'takeScreenshot',
      'terminateApp',
      'uninstallApp',
      'unmatchFace',
      'unmatchFinger',
      'unreverseTcpPort',
    ]);

    this._appsConfig = appsConfig;
    this._behaviorConfig = behaviorConfig;
    this._deviceConfig = deviceConfig;
    this._sessionConfig = sessionConfig;
    this._emitter = eventEmitter;
    this._errorComposer = runtimeErrorComposer;

    this._appLaunchArgs = new LaunchArgsEditor();

    this.deviceDriver = deviceDriver;
    this.deviceDriver.validateDeviceConfig(deviceConfig);
    this.debug = debug;
  }

  get id() {
    return this.deviceDriver.getExternalId();
  }

  get name() {
    return this.deviceDriver.getDeviceName();
  }

  get type() {
    return this._deviceConfig.type;
  }

  get appLaunchArgs() {
    return this._appLaunchArgs;
  }

  get _currentApp() {
    const alias = this.deviceDriver.selectedApp;
    return this._appsConfig[alias];
  }

  async _prepare() {
    const appAliases = Object.keys(this._appsConfig);
    if (appAliases.length === 1) {
      await this.selectApp(appAliases[0]);
    }
  }

  async selectApp(alias) {
    if (alias === undefined) {
      throw this._errorComposer.cantSelectEmptyApp();
    }

    if (this._currentApp) {
      await this.terminateApp();
    }

    if (alias === null) { // Internal use to unselect the app
      this.deviceDriver.clearSelectedApp();
      return;
    }

    const appConfig = this._appsConfig[alias];
    if (!appConfig) {
      throw this._errorComposer.cantFindApp(alias);
    }

    this.deviceDriver.selectApp(alias);

    this._appLaunchArgs.reset();
    this._appLaunchArgs.modify(this._currentApp.launchArgs);
    await this._inferBundleIdFromBinary();
  }

  async launchApp(params = {}, appId = this._appId) {
    return traceCall('launchApp', () => this._doLaunchApp(params, appId));
  }

  /**
   * @deprecated
   */
  async relaunchApp(params = {}, appId) {
    if (params.newInstance === undefined) {
      params['newInstance'] = true;
    }
    await this.launchApp(params, appId);
  }

  async takeScreenshot(name) {
    if (!name) {
      throw new DetoxRuntimeError('Cannot take a screenshot with an empty name.');
    }

    return this.deviceDriver.takeScreenshot(name);
  }

  async captureViewHierarchy(name = 'capture') {
    return this.deviceDriver.captureViewHierarchy(name);
  }

  async sendToHome() {
    await this.deviceDriver.sendToHome();
    await this.deviceDriver.waitForBackground();
  }

  async setBiometricEnrollment(toggle) {
    const yesOrNo = toggle ? 'YES' : 'NO';
    await this.deviceDriver.setBiometricEnrollment(yesOrNo);
  }

  async matchFace() {
    await this.deviceDriver.matchFace();
    await this.deviceDriver.waitForActive();
  }

  async unmatchFace() {
    await this.deviceDriver.unmatchFace();
    await this.deviceDriver.waitForActive();
  }

  async matchFinger() {
    await this.deviceDriver.matchFinger();
    await this.deviceDriver.waitForActive();
  }

  async unmatchFinger() {
    await this.deviceDriver.unmatchFinger();
    await this.deviceDriver.waitForActive();
  }

  async shake() {
    await this.deviceDriver.shake();
  }

  async terminateApp(appId) {
    const _appId = appId || this._appId;
    await this.deviceDriver.terminate(_appId);
  }

  async installApp(binaryPath, testBinaryPath) {
    await traceCall('appInstall', () => {
      const currentApp = binaryPath ? { binaryPath, testBinaryPath } : this._getCurrentApp();
      return this.deviceDriver.installApp(currentApp.binaryPath, currentApp.testBinaryPath);
    });
  }

  async uninstallApp(appId) {
    const _appId = appId || this._appId;
    await traceCall('appUninstall', () =>
      this.deviceDriver.uninstallApp(_appId));
  }

  async installUtilBinaries() {
    const paths = this._deviceConfig.utilBinaryPaths;
    if (paths) {
      await traceCall('installUtilBinaries', () =>
        this.deviceDriver.installUtilBinaries(paths));
    }
  }

  async reloadReactNative() {
    await traceCall('reloadRN', () =>
      this.deviceDriver.reloadReactNative());
  }

  async openURL(params) {
    if (typeof params !== 'object' || !params.url) {
      throw new DetoxRuntimeError(`openURL must be called with JSON params, and a value for 'url' key must be provided. example: await device.openURL({url: "url", sourceApp[optional]: "sourceAppBundleID"}`);
    }

    await this.deviceDriver.deliverPayload(params);
  }

  async setOrientation(orientation) {
    await this.deviceDriver.setOrientation(orientation);
  }

  async setLocation(lat, lon) {
    lat = String(lat);
    lon = String(lon);
    await this.deviceDriver.setLocation(lat, lon);
  }

  async reverseTcpPort(port) {
    await this.deviceDriver.reverseTcpPort(port);
  }

  async unreverseTcpPort(port) {
    await this.deviceDriver.unreverseTcpPort(port);
  }

  async clearKeychain() {
    await this.deviceDriver.clearKeychain();
  }

  async sendUserActivity(params) {
    await this._sendPayload('detoxUserActivityDataURL', params);
  }

  async sendUserNotification(params) {
    await this._sendPayload('detoxUserNotificationDataURL', params);
  }

  async setURLBlacklist(urlList) {
    await this.deviceDriver.setURLBlacklist(urlList);
  }

  async enableSynchronization() {
    await this.deviceDriver.enableSynchronization();
  }

  async disableSynchronization() {
    await this.deviceDriver.disableSynchronization();
  }

  async resetContentAndSettings() {
    await this.deviceDriver.resetContentAndSettings();
  }

  getPlatform() {
    return this.deviceDriver.getPlatform();
  }

  async pressBack() {
    await this.deviceDriver.pressBack();
  }

  getUiDevice() {
    return this.deviceDriver.getUiDevice();
  }

  async setStatusBar(params) {
    await this.deviceDriver.setStatusBar(params);
  }

  async resetStatusBar() {
    await this.deviceDriver.resetStatusBar();
  }

  async _cleanup() {
    const appId = this._currentApp && this._currentApp.bundleId; // TODO (multiapps) Might be able to rename bundleId->appId
    await this.deviceDriver.cleanup(appId);
  }

  /**
   * @internal
   */
  async _typeText(text) {
    await this.deviceDriver.typeText(text);
  }

  get _appId() {
    return this._getCurrentApp().bundleId; // TODO (multiapps) Might be able to rename bundleId->appId here too
  }

  _getCurrentApp() {
    if (!this._currentApp) {
      throw this._errorComposer.appNotSelected();
    }
    return this._currentApp;
  }

  async _doLaunchApp(launchParams, appId) {
    const payloadParams = ['url', 'userNotification', 'userActivity'];
    const hasPayload = this._assertHasSingleParam(payloadParams, launchParams);
    const newInstance = (launchParams.newInstance !== undefined)
      ? launchParams.newInstance
      : !this.deviceDriver.isAppRunning(appId);

    if (launchParams.delete) {
      await this.terminateApp(appId);
      await this.uninstallApp();
      await this.installApp();
    } else if (newInstance) {
      await this.terminateApp(appId);
    }

    if (launchParams.permissions) {
      await this.deviceDriver.setPermissions(appId, launchParams.permissions);
    }

    const launchArgs = this._prepareLaunchArgs(launchParams);

    if (this.deviceDriver.isAppRunning(appId) && hasPayload) {
      await this.deviceDriver.deliverPayload({ ...launchParams, delayPayload: true });
    }

    if (this._behaviorConfig.launchApp === 'manual') {
      await this.deviceDriver.waitForAppLaunch(appId, launchArgs, launchParams.languageAndLocale);
    } else {
      await this.deviceDriver.launchApp(appId, launchArgs, launchParams.languageAndLocale);
    }

    if (launchParams.detoxUserNotificationDataURL) {
      await this.deviceDriver.cleanupRandomDirectory(launchParams.detoxUserNotificationDataURL);
    }

    if(launchParams.detoxUserActivityDataURL) {
      await this.deviceDriver.cleanupRandomDirectory(launchParams.detoxUserActivityDataURL);
    }
  }

  async _sendPayload(key, params) {
    const payloadFilePath = this.deviceDriver.createPayloadFile(params);
    const payload = {
      [key]: payloadFilePath,
    };
    await this.deviceDriver.deliverPayload(payload);
    this.deviceDriver.cleanupRandomDirectory(payloadFilePath);
  }

  _assertHasSingleParam(singleParams, params) {
    let paramsCounter = 0;

    singleParams.forEach((item) => {
      if(params[item]) {
        paramsCounter += 1;
      }
    });

    if (paramsCounter > 1) {
      throw new DetoxRuntimeError(`Call to 'launchApp(${JSON.stringify(params)})' must contain only one of ${JSON.stringify(singleParams)}.`);
    }

    return (paramsCounter === 1);
  }

  _prepareLaunchArgs(launchParams) {
    const baseLaunchArgs = {
      ...this._appLaunchArgs.get(),
      ...launchParams.launchArgs,
    };

    if (launchParams.url) {
      baseLaunchArgs['detoxURLOverride'] = launchParams.url;
      if (launchParams.sourceApp) {
        baseLaunchArgs['detoxSourceAppOverride'] = launchParams.sourceApp;
      }
    } else if (launchParams.userNotification) {
      this._createPayloadFileAndUpdatesParamsObject('userNotification', 'detoxUserNotificationDataURL', launchParams, baseLaunchArgs);
    } else if (launchParams.userActivity) {
      this._createPayloadFileAndUpdatesParamsObject('userActivity', 'detoxUserActivityDataURL', launchParams, baseLaunchArgs);
    }

    if (launchParams.disableTouchIndicators) {
      baseLaunchArgs['detoxDisableTouchIndicators'] = true;
    }

    return {
      detoxServer: this._sessionConfig.server,
      detoxSessionId: this._sessionConfig.sessionId,
      ...baseLaunchArgs,
    };
  }

  _createPayloadFileAndUpdatesParamsObject(key, launchKey, params, baseLaunchArgs) {
    const payloadFilePath = this.deviceDriver.createPayloadFile(params[key]);
    baseLaunchArgs[launchKey] = payloadFilePath;
    //`params` will be used later for `predeliverPayload`, so remove the actual notification and add the file URL
    delete params[key];
    params[launchKey] = payloadFilePath;
  }

  async _onTestEnd(testSummary) {
    await this.deviceDriver.onTestEnd(testSummary);
  }

  async _inferBundleIdFromBinary() {
    const { binaryPath, bundleId } = this._currentApp; // TODO (multiapps) Might be able to rename bundleId->appId

    if (!bundleId) {
      this._currentApp.bundleId = await this.deviceDriver.getBundleIdFromBinary(binaryPath);
    }
  }
}

module.exports = RuntimeDevice;
