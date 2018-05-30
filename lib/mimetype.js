'use strict';

const mime = require('mime');

class Mimetype {
  static getWithCharset(localFile, stat, callback) {
    const mimeType = mime.getType(localFile);
    const charset = mimeType.indexOf('text/') === 0 ? 'utf-8' : null;
    const ContentType = charset ? mimeType + '; charset=' + charset : mimeType;
    callback(null, { ContentType });
  }
}

module.exports = Mimetype;
