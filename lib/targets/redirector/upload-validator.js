'use strict';

const request = require('superagent');
const glob = require('glob');
const delay = require('@emartech/delay-js');

class UploadValidator {
  static validate(config, revision) {
    const uploadedFiles = this._getLocalFiles(config);
    const firstFileUrl = this._getUploadedFileUrl(config, revision, uploadedFiles);

    return delay.wait(config.validationWaitTime).then(
      () => request.get(firstFileUrl).then(result => result)
    );
  }

  static _getLocalFiles(config) {
    return glob.sync(config.localDir + '/**')
      .filter(fileName => fileName.includes('.'))
      .map(fileName => fileName.replace(config.localDir + '/', ''));
  }

  static _getUploadedFileUrl(config, revision, uploadedFiles) {
    return 'https://' + config.redirector.target + '/' + config.projectName +
      '/' + revision + '/' + uploadedFiles[0];
  }
}

module.exports = UploadValidator;
