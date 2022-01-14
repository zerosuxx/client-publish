'use strict';

const path = require('path');
const process = require('process');
const fs = require('fs');

const REVISION_TYPE_ENV = 'enviroment';
const REVISION_TYPE_TIMESTAMP = 'timestamp';
const REVISION_TYPE_PACKAGE = 'package';

class Revision {
  static get(type, defaultRevision = null) {
    if (defaultRevision) {
      return defaultRevision;
    }

    if (!this._lastRevision) {
      this._lastRevision = this._computeRevision(type);
    }

    return this._lastRevision;
  }

  static _computeRevision(type) {
    switch (type) {
      case REVISION_TYPE_ENV:
        return process.env.PROJECT_REVISION;

      case REVISION_TYPE_PACKAGE:
        const currentWorkingDir = process.cwd();
        const packageJsonPath = path.join(currentWorkingDir, 'package.json');
        const packageJsonContents = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageInformation = JSON.parse(packageJsonContents);

        return packageInformation.version;

      case REVISION_TYPE_TIMESTAMP:
      default:
        return Math.round(Date.now() / 1000);
    }
  }

  static set(revision) {
    this._lastRevision = revision;
  }
}

module.exports = Revision;
module.exports.REVISION_TYPE_ENV = REVISION_TYPE_ENV;
module.exports.REVISION_TYPE_TIMESTAMP = REVISION_TYPE_TIMESTAMP;
module.exports.REVISION_TYPE_PACKAGE = REVISION_TYPE_PACKAGE;
