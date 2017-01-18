'use strict';

let childProcess = require('child-process-promise');

class Merge {
  static toProduction() {
    let command = 'git pull origin master; git push origin master;git push origin master:production';
    return childProcess.exec(command);
  }
}

module.exports = Merge;
