'use strict';

const ConfigValidator = require('../../utils/config-validator');

class FirebaseConfigValidator extends ConfigValidator {
  static _checkValues(config) {
    this._checkRequired(config.firebase.project, 'FIREBASE_PROJECT');
    this._checkRequired(config.firebase.site, 'FIREBASE_SITE');
  }
}

module.exports = FirebaseConfigValidator;
