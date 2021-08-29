const fs = require('fs');
const path = require('path');

const exec = require('child-process-promise').exec;
const _ = require('lodash');

const temporaryPath = require('../../../../artifacts/utils/temporaryPath');
const DetoxRuntimeError = require('../../../../errors/DetoxRuntimeError');
const environment = require('../../../../utils/environment');
const getAbsoluteBinaryPath = require('../../../../utils/getAbsoluteBinaryPath');
const log = require('../../../../utils/logger').child({ __filename });
const pressAnyKey = require('../../../../utils/pressAnyKey');

const IosDriver = require('./IosDriver');

class SimulatorDriver extends IosDriver {
  /**
   * @param udid { String } The unique cross-OS identifier of the simulator
   * @param type { String }
   * @param config { Object }
   * @param config.simulatorLauncher { SimulatorLauncher }
   * @param config.applesimutils { AppleSimUtils }
   */
  constructor(udid, type, config) {
    super(config);

    this.udid = udid;
    this._deviceName = `${udid} (${type})`;
    this._simulatorLauncher = config.simulatorLauncher;
    this._applesimutils = config.applesimutils;
  }

  getExternalId() {
    return this.udid;
  }

  getDeviceName() {
    return this._deviceName;
  }

  async prepare() {
    const detoxFrameworkPath = await environment.getFrameworkPath();

    if (!fs.existsSync(detoxFrameworkPath)) {
      throw new DetoxRuntimeError(`${detoxFrameworkPath} could not be found, this means either you changed a version of Xcode or Detox postinstall script was unsuccessful.
      To attempt a fix try running 'detox clean-framework-cache && detox build-framework-cache'`);
    }
  }

  async getBundleIdFromBinary(appPath) {
    appPath = getAbsoluteBinaryPath(appPath);
    try {
      const result = await exec(`/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" "${path.join(appPath, 'Info.plist')}"`);
      const bundleId = _.trim(result.stdout);
      if (_.isEmpty(bundleId)) {
        throw new Error();
      }
      return bundleId;
    } catch (ex) {
      throw new DetoxRuntimeError(`field CFBundleIdentifier not found inside Info.plist of app binary at ${appPath}`);
    }
  }

  async installApp(binaryPath) {
    await this._applesimutils.install(this.udid, getAbsoluteBinaryPath(binaryPath));
  }

  async uninstallApp(bundleId) {
    const { udid } = this;
    await this.emitter.emit('beforeUninstallApp', { deviceId: udid, bundleId });
    await this._applesimutils.uninstall(udid, bundleId);
  }

  async launchApp(bundleId, launchArgs, languageAndLocale) {
    const { udid } = this;
    await this.emitter.emit('beforeLaunchApp', { bundleId, deviceId: udid, launchArgs });
    const pid = await this._applesimutils.launch(udid, bundleId, launchArgs, languageAndLocale);
    await this.emitter.emit('launchApp', { bundleId, deviceId: udid, launchArgs, pid });

    return pid;
  }

  async waitForAppLaunch(bundleId, launchArgs, languageAndLocale) {
    const { udid } = this;

    await this.emitter.emit('beforeLaunchApp', { bundleId, deviceId: udid, launchArgs });

    this._applesimutils.printLaunchHint(udid, bundleId, launchArgs, languageAndLocale);
    await pressAnyKey();

    const pid = await this._applesimutils.getPid(udid, bundleId);
    if (Number.isNaN(pid)) {
      throw new DetoxRuntimeError({
        message: `Failed to find a process corresponding to the app bundle identifier (${bundleId}).`,
        hint: `Make sure that the app is running on the device (${udid}), visually or via CLI:\n` +
              `xcrun simctl spawn ${deviceId} launchctl list | grep -F '${bundleId}'\n`,
      });
    } else {
      log.info({}, `Found the app (${bundleId}) with process ID = ${pid}. Proceeding...`);
    }

    await this.emitter.emit('launchApp', { bundleId, deviceId: udid, launchArgs, pid });
    return pid;
  }

  async terminate(bundleId) {
    const { udid } = this;
    await this.emitter.emit('beforeTerminateApp', { deviceId: udid, bundleId });
    await this._applesimutils.terminate(udid, bundleId);
    await this.emitter.emit('terminateApp', { deviceId: udid, bundleId });
  }

  async setBiometricEnrollment(yesOrNo) {
    await this._applesimutils.setBiometricEnrollment(this.udid, yesOrNo);
  }

  async matchFace() {
    await this._applesimutils.matchBiometric(this.udid, 'Face');
  }

  async unmatchFace() {
    await this._applesimutils.unmatchBiometric(this.udid, 'Face');
  }

  async matchFinger() {
    await this._applesimutils.matchBiometric(this.udid, 'Finger');
  }

  async unmatchFinger() {
    await this._applesimutils.unmatchBiometric(this.udid, 'Finger');
  }

  async sendToHome() {
    await this._applesimutils.sendToHome(this.udid);
  }

  async setLocation(lat, lon) {
    await this._applesimutils.setLocation(this.udid, lat, lon);
  }

  async setPermissions(bundleId, permissions) {
    await this._applesimutils.setPermissions(this.udid, bundleId, permissions);
  }

  async clearKeychain() {
    await this._applesimutils.clearKeychain(this.udid);
  }

  async resetContentAndSettings() {
    await this._simulatorLauncher.shutdown(this.udid);
    await this._applesimutils.resetContentAndSettings(this.udid);
    await this._simulatorLauncher.launch(this.udid);
  }

  getLogsPaths() {
    return this._applesimutils.getLogsPaths(this.udid);
  }

  async waitForActive() {
    return await this.client.waitForActive();
  }

  async waitForBackground() {
    return await this.client.waitForBackground();
  }

  async takeScreenshot(screenshotName) {
    const tempPath = await temporaryPath.for.png();
    await this._applesimutils.takeScreenshot(this.udid, tempPath);

    await this.emitter.emit('createExternalArtifact', {
      pluginId: 'screenshot',
      artifactName: screenshotName || path.basename(tempPath, '.png'),
      artifactPath: tempPath,
    });

    return tempPath;
  }

  async captureViewHierarchy(artifactName) {
    const viewHierarchyURL = temporaryPath.for.viewhierarchy();
    await this.client.captureViewHierarchy({ viewHierarchyURL });

    await this.emitter.emit('createExternalArtifact', {
      pluginId: 'uiHierarchy',
      artifactName: artifactName,
      artifactPath: viewHierarchyURL,
    });

    return viewHierarchyURL;
  }

  async setStatusBar(flags) {
    await this._applesimutils.statusBarOverride(this.udid, flags);
  }

  async resetStatusBar() {
    await this._applesimutils.statusBarReset(this.udid);
  }
}

module.exports = SimulatorDriver;
