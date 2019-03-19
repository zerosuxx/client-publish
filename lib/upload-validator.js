'use strict';

let config = require('../config');
let request = require('superagent');
let glob = require('glob');
let delay = t => new Promise(resolve => setTimeout(resolve, t));

class UploadValidator {
  static validate(revision) {
    const uploadedFiles = this._getUploadedFiles();
    const firstFileUrl = this._getUploadedFileUrl(revision, uploadedFiles);

    return delay(1000)
      .then(
        () => request.get(firstFileUrl).then(result => result)
      );
  }

  static _getUploadedFiles() {
    return glob.sync(config.localDir + '/**')
      .filter(fileName => fileName.includes('.'))
      .map(fileName => fileName.replace(config.localDir + '/', ''));
  }

  static _getUploadedFileUrl(revision, uploadedFiles) {
    return 'https://' + config.redirector.target + '/' + config.projectName +
      '/' + revision + '/' + uploadedFiles[0]
  }
}

module.exports = UploadValidator;
