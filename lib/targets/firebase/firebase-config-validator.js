'use strict';

const ConfigValidator = require('../../utils/config-validator');

class FirebaseConfigValidator extends ConfigValidator {
  static _checkValues(config) {
    this._checkRequired(config.firebase.project, 'FIREBASE_PROJECT');
    this._checkRequired(config.firebase.site, 'PROJECT_NAME or FIREBASE_SITE');
    this._checkRequired(config.firebase.accessToken, 'FIREBASE_TOKEN');

    if (!config.projectHasCustomName) {
      this._checkPath(config.firebase.site);
    }
  }
}

module.exports = FirebaseConfigValidator;
