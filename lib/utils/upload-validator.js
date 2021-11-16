'use strict';

const request = require('superagent');
const glob = require('glob');
const delay = require('@emartech/delay-js');
const NotImplementedError = require('./not-implemented-error');

class UploadValidator {
  static validateUpload(config, revision) {
    if (this === undefined) {
      throw new NotImplementedError('You must implement the _getFirstUploadedFileUrl method');
    }

    const localFiles = this._getLocalFiles(config);
    const firstFileUrl = this._getFirstUploadedFileUrl(config, revision, localFiles);

    return delay.wait(config.validationWaitTime).then(
      () => request.get(firstFileUrl).then(result => result)
    );
  }

  static _getLocalFiles(config) {
    return glob.sync(config.localDir + '/**')
      .filter(fileName => fileName.includes('.'))
      .map(fileName => fileName.replace(config.localDir + '/', ''));
  }

  static _getFirstUploadedFileUrl() {
    throw new NotImplementedError();
  }
}

module.exports = UploadValidator;
