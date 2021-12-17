'use strict';

const firebase = require('firebase-tools');
const { promises: fs } = require('fs');

class Firebase {
  static async save(config, revision) {
    return firebase.deploy({
      'only': 'hosting',
      project: config.firebase.project,
      site: config.firebase.site,
      message: revision.toString()
    });
  }

  static async createCredentialsJSON(config) {
    try {
      JSON.parse(config.firebase.credentials.content);
    } catch (error) {
      return { success: false, message: '> JSON input is not valid' };
    }

    try {
      await fs.writeFile(config.firebase.credentials.path, config.firebase.credentials.content);
    } catch (error) {
      return { success: false, message: '> Writing JSON file failed' };
    }

    return { success: true, message: '> Credentials JSON creation successfull' };
  }
}

module.exports = Firebase;
