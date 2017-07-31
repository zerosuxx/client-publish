'use strict';

const mime = require('mime');

class Mimetype {
  static getWithCharset(localFile, stat, callback) {
    const mimeType = mime.lookup(localFile);
    const charset = mime.charsets.lookup(mimeType);
    const ContentType = charset ? mimeType + '; charset=' + charset.toLowerCase() : mimeType;
    callback(null, { ContentType });
  }
}

module.exports = Mimetype;
