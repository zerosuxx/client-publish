'use strict';

const path = require('path');
const NotImplementedError = require('./not-implemented-error');

class ConfigValidator {
  static validateConfig(config) {
    if (this === undefined) {
      throw new NotImplementedError('You must implement the _checkValues method');
    }

    try {
      this._checkValues(config);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, message: error.message };
    }
  }

  static _checkValues() {
    throw new NotImplementedError();
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
