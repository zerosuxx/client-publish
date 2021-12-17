'use strict';

const UploadValidator = require('../../utils/upload-validator');

class RedirectorUploadValidator extends UploadValidator {
  static _getFirstUploadedFileUrl(config, revision, uploadedFiles) {
    return 'https://' + config.redirector.target + '/' + config.projectName +
      '/' + revision + '/' + uploadedFiles[0];
  }
}

module.exports = RedirectorUploadValidator;
