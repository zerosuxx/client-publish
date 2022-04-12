'use strict';

const s3 = require('@auth0/s3');

const EventEmitter = require('../../utils/event-emitter');
const Mimetype = require('../../utils/mimetype');

class S3Wrapper {
  static publish(config, revision) {
    let s3Options = {
      region: config.get('s3.credentials.region'),
      accessKeyId: config.get('s3.credentials.accessKeyId'),
      secretAccessKey: config.get('s3.credentials.secretAccessKey')
    };

    let client = s3.createClient({ s3Options });
    let Prefix = revision;
    if (config.get('projectName')) {
      Prefix = config.get('projectName') + '/' + Prefix;
    }

    let uploadParams = {
      localDir: config.get('localDir'),
      s3Params: Object.assign({ Prefix }, config.get('s3.uploadParameters')),
      getS3Params: Mimetype.getWithCharset
    };

    return EventEmitter.promisify(client.uploadDir(uploadParams));
  }
}

module.exports = S3Wrapper;
