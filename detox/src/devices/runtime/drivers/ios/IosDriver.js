const fs = require('fs');
const path = require('path');

const DetoxRuntimeError = require('../../../../errors/DetoxRuntimeError');
const DeviceDriverBase = require('../DeviceDriverBase');

class IosDriver extends DeviceDriverBase {
  createPayloadFile(notification) {
    const notificationFilePath = path.join(this.createRandomDirectory(), `payload.json`);
    fs.writeFileSync(notificationFilePath, JSON.stringify(notification, null, 2));
    return notificationFilePath;
  }

  async setURLBlacklist(blacklistURLs) {
    return await this.client.setSyncSettings({ blacklistURLs: blacklistURLs });
  }

  async enableSynchronization() {
    return await this.client.setSyncSettings({ enabled: true });
  }

  async disableSynchronization() {
    return await this.client.setSyncSettings({ enabled: false });
  }

  async shake() {
    return await this.client.shake();
  }

  async setOrientation(orientation) {
    if (!['portrait', 'landscape'].some(option => option === orientation)) throw new DetoxRuntimeError("orientation should be either 'portrait' or 'landscape', but got " + (orientation + ')'));
    return await this.client.setOrientation({ orientation });
  }

  getPlatform() {
    return 'ios';
  }
}

module.exports = IosDriver;
