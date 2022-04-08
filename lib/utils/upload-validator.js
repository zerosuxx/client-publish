'use strict';

const request = require('superagent');
const glob = require('glob');
const delay = require('@emartech/delay-js');
const NotImplementedError = require('./not-implemented-error');

class UploadValidator {
  static async validateUpload(config, revision) {
    if (this === undefined) {
      throw new NotImplementedError('You must implement the _getFirstUploadedFileUrl method');
    }

    const localFiles = this._getLocalFiles(config);
    const firstFileUrl = this._getFirstUploadedFileUrl(config, revision, localFiles);

    await delay.wait(config.get('validationWaitTime'));

    try {
      await request.get(firstFileUrl);
      return { isValid: true };
    } catch (error) {
      return { isValid: false, validatedFile: firstFileUrl, message: error.message };
    }
  }

  static _getLocalFiles(config) {
    return glob.sync(config.get('localDir') + '/**')
      .filter(fileName => fileName.includes('.'))
      .map(fileName => fileName.replace(config.get('localDir') + '/', ''));
  }

  static _getFirstUploadedFileUrl() {
    throw new NotImplementedError();
  }
}

module.exports = UploadValidator;
