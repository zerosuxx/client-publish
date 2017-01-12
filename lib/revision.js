'use strict';

let argv = require('yargs').argv;
let revision = null;

module.exports = {
  get: function(type) {
    if (argv.revision) {
      return argv.revision;
    }

    if (!revision) {
      switch (type) {
        case 'package':
          revision = require('../package.json').version;
          break;

        case 'timestamp':
        default:
          revision = Math.round(Date.now() / 1000);
      }
    }

    return revision;
  },

  set: function(newRevision) {
    revision = newRevision;
  }
};
