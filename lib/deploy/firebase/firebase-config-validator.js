'use strict';

const ConfigValidator = require('../../utils/config-validator');

class FirebaseConfigValidator extends ConfigValidator {
  static _checkValues(config) {
    this._checkRequired(config.get('firebase.project'), 'FIREBASE_PROJECT');
    this._checkRequired(config.get('firebase.site'), 'FIREBASE_SITE');
    this._checkRequired(config.get('firebase.credentials'), 'GOOGLE_APPLICATION_CREDENTIALS_JSON');
  }
}

module.exports = FirebaseConfigValidator;
