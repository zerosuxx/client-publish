'use strict';

const firebase = require('firebase-tools');

class Firebase {
  static async save(config, revision) {
    return firebase.deploy({
      'only': 'hosting',
      project: config.firebase.project,
      site: config.firebase.site,
      message: revision.toString()
    });
  }
}

module.exports = Firebase;
