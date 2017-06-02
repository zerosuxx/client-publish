'use strict';

const path = require('path');

class ConfigValidator {
  static checkValues(config) {
    this._checkRequired(config.redirector.name, 'PROJECT_NAME');
    this._checkRequired(config.redirector.apiSecret, 'REDIRECTOR_API_SECRET');
    this._checkRequired(config.s3.credentials.accessKeyId, 'AWS_ACCESS_KEY_ID');
    this._checkRequired(config.s3.credentials.secretAccessKey, 'AWS_SECRET_ACCESS_KEY');

    if (!config.projectHasCustomName) {
      this._checkPath(config.redirector.name);
    }
  }

  static _checkRequired(value, valueName) {
    if (!value) {
      throw new Error(`${valueName} is missing`);
    }
  }

  static _checkPath(projectName) {
    const currentDirectory = path.basename(process.cwd());

    if (currentDirectory.indexOf(projectName) === -1) {
      throw new Error('Current directory does not contain PROJECT_NAME');
    }
  }
}

module.exports = ConfigValidator;
