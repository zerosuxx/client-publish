'use strict';

const mime = require('mime');

class Mimetype {
  static getWithCharset(localFile, stat, callback) {
    const mimeType = mime.getType(localFile);
    const charset = (/^text\/|^application\/(javascript|json)/).test(mimeType) ? 'utf-8' : null;
    const ContentType = charset ? mimeType + '; charset=' + charset : mimeType;
    callback(null, { ContentType });
  }
}

module.exports = Mimetype;
