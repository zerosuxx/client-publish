'use strict';

module.exports = {
  promisify(emitter) {
    return new Promise(function(resolve, reject) {
      emitter.on('end', resolve);
      emitter.on('error', reject);
    });
  }
};
