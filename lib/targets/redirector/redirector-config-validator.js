'use strict';

const ConfigValidator = require('../../utils/config-validator');

class RedirectorConfigValidator extends ConfigValidator {
  static _checkValues(config) {
    this._checkRequired(config.redirector.name, 'PROJECT_NAME');
    this._checkRequired(config.redirector.apiSecret, 'REDIRECTOR_API_SECRET');
    this._checkRequired(config.s3.credentials.accessKeyId, 'AWS_ACCESS_KEY_ID');
    this._checkRequired(config.s3.credentials.secretAccessKey, 'AWS_SECRET_ACCESS_KEY');

    if (!config.projectHasCustomName) {
      this._checkPath(config.redirector.name);
    }
  }
}

module.exports = RedirectorConfigValidator;
