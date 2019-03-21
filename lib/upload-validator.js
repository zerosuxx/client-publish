'use strict';

const config = require('../config');
const request = require('superagent');
const glob = require('glob');
const delay = require('@emartech/delay-js');

class UploadValidator {
  static validate(revision) {
    const uploadedFiles = this._getLocalFiles();
    const firstFileUrl = this._getUploadedFileUrl(revision, uploadedFiles);

    return delay.wait(config.validationWaitTime).then(
      () => request.get(firstFileUrl).then(result => result)
    );
  }

  static _getLocalFiles() {
    return glob.sync(config.localDir + '/**')
      .filter(fileName => fileName.includes('.'))
      .map(fileName => fileName.replace(config.localDir + '/', ''));
  }

  static _getUploadedFileUrl(revision, uploadedFiles) {
    return 'https://' + config.redirector.target + '/' + config.projectName +
      '/' + revision + '/' + uploadedFiles[0];
  }
}

module.exports = UploadValidator;
