'use strict';

let s3 = require('s3');
let EventEmitter = require('../lib/event-emitter');
let config = require('../config');
let Mimetype = require('./mimetype');


class S3Wrapper {
  static publish(revision) {
    let client = s3.createClient({ s3Options: config.s3.credentials });
    let Prefix = revision;
    if (config.projectName) {
      Prefix = config.projectName + '/' + Prefix;
    }

    let uploadParams = {
      localDir: config.localDir,
      s3Params: Object.assign({ Prefix }, config.s3.uploadParameters),
      getS3Params: Mimetype.getWithCharset
    };

    return EventEmitter.promisify(client.uploadDir(uploadParams));
  }
}

module.exports = S3Wrapper;
