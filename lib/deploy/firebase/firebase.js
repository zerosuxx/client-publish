'use strict';

const firebase = require('firebase-tools');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');

class Firebase {
  static async save(config, revision) {
    const deployer = new Firebase(config, revision);
    await deployer.setup();
    await deployer.deploy();
    await deployer.cleanup();
  }

  constructor(config, revision) {
    this._config = config;
    this._revision = revision.toString();
    this._credentials = {
      envKey: 'GOOGLE_APPLICATION_CREDENTIALS',
      tempFile: path.join(os.tmpdir(), `firebase_credentials_${this._revision}.json`)
    };
  }

  async setup() {
    await fs.writeFile(
      this._credentials.tempFile,
      Buffer.from(this._config.get('firebase.credentials'), 'base64')
    );
    process.env[this._credentials.envKey] = this._credentials.tempFile;

    await this._createConfigFileIfNotExists();
  }

  async deploy() {
    return firebase.deploy({
      'only': 'hosting',
      project: this._config.get('firebase.project'),
      site: this._config.get('firebase.site'),
      message: this._revision
    });
  }

  async cleanup() {
    await fs.rm(this._credentials.tempFile, { force: true });
    delete process.env[this._credentials.envKey];
  }

  async _createConfigFileIfNotExists() {
    try {
      await fs.stat(this._config.get('firebase.configFile'));
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(
          this._config.get('firebase.configFile'),
          JSON.stringify({ hosting: { public: this._config.get('localDir') } }, null, 2)
        );

        return;
      }

      throw error;
    }
  }
}

module.exports = Firebase;
