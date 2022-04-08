'use strict';

const firebase = require('firebase-tools');

class Firebase {
  static async save(config, revision) {
    return firebase.deploy({
      'only': 'hosting',
      project: config.get('firebase.project'),
      site: config.get('firebase.site'),
      message: revision.toString()
    });
  }
}

module.exports = Firebase;
