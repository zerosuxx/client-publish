'use strict';

const mime = require('mime');

class Mimetype {
  static getWithCharset(localFile, stat, callback) {
    const mimeType = mime.lookup(localFile);
    const charset = mime.charsets.lookup(mimeType);
    if (!charset) {
      return callback(new Error('Charset not found'), null);
    }

    const mimeTypeWithCharset = mimeType + '; charset=' + charset.toLowerCase();
    const params = {
      ContentType: mimeTypeWithCharset
    };
    callback(null, params);
  }
}

module.exports = Mimetype;
