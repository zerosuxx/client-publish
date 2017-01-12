'use strict';

let argv = require('yargs').argv;
const REVISION_TYPE_TIMESTAMP = 'timestamp';


class Revision {
  static get(type) {
    if (argv.revision) {
      return argv.revision;
    }

    return this._lastRevision ? this._lastRevision : this._computeRevision(type);
  }

  static _computeRevision(type) {
    switch (type) {
      case 'package':
        return require('../package.json').version;
        break;

      case 'timestamp':
      default:
        return Math.round(Date.now() / 1000);
    }
  }

  static set(revision) {
    this._lastRevision = revision;
  }
}

module.exports = Revision;
module.exports.REVISION_TYPE_TIMESTAMP = REVISION_TYPE_TIMESTAMP;
