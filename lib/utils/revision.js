'use strict';

const path = require('path');
const process = require('process');
const fs = require('fs');
const childProcess = require('child_process'); // eslint-disable-line security/detect-child-process
const conventionalRecommendedBump = require('conventional-recommended-bump');
const semver = require('semver');

class Revision {
  static get REVISION_TYPE() {
    return {
      ENV: 'env',
      TIMESTAMP: 'timestamp',
      PACKAGE: 'package',
      GIT_TAG: 'git-tag'
    };
  };

  static get(type, defaultRevision = null) {
    if (defaultRevision) {
      return defaultRevision;
    }

    if (!this._lastRevision) {
      this._lastRevision = this._computeRevision(type);
    }

    return this._lastRevision;
  }

  static async getNext(type, defaultRevision = null) {
    const currentRevision = Revision.get(type, defaultRevision);

    return this._computeNextRevision(currentRevision);
  }

  static _computeRevision(type) {
    switch (type) {
      case Revision.REVISION_TYPE.ENV:
        return process.env.PROJECT_REVISION;

      case Revision.REVISION_TYPE.PACKAGE:
        const currentWorkingDir = process.cwd();
        const packageJsonPath = path.join(currentWorkingDir, 'package.json');
        const packageJsonContents = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageInformation = JSON.parse(packageJsonContents);

        return packageInformation.version;

      case Revision.REVISION_TYPE.GIT_TAG:
        const latestGitRev = childProcess.execSync('git rev-list --tags --max-count=1', { encoding: 'utf-8' });
        const latestGitTag = childProcess.execSync(`git describe --tags ${latestGitRev}`, { encoding: 'utf-8' });

        return semver.clean(latestGitTag);

      case Revision.REVISION_TYPE.TIMESTAMP:
      default:
        return Math.round(Date.now() / 1000);
    }
  }

  static _computeNextRevision(currentRevision) {
    return new Promise((resolve, reject) => {
      conventionalRecommendedBump({ preset: 'angular' }, (error, recommendation) => {
        if (error) {
          reject(error);
        }

        const nextRevision = semver.inc(currentRevision, recommendation.releaseType);
        resolve(nextRevision);
      });

    });
  }

  static set(revision) {
    this._lastRevision = revision;
  }
}

module.exports = Revision;
