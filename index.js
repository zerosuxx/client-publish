'use strict';

const Revision = require('./lib/utils/revision');

const { deployToRedirector, deployToFirebase } = require('./lib/targets');
const { mergeMasterToProduction } = require('./lib/commands');

const config = require('./config');
const argv = require('yargs').argv;
const inquirer = require('inquirer');

module.exports.deploy = function() {
  const revision = Revision.get(Revision.REVISION_TYPE_TIMESTAMP, argv.revision);

  this.deployWithRevision(revision);
};

module.exports.deployWithRevision = function(revision) {
  if (config.deployTargets.includes('redirector')) {
    deployToRedirector(config, revision);
  }

  if (config.deployTargets.includes('firebase')) {
    deployToFirebase(config, revision);
  }
};

module.exports.merge = function() {
  let question = {
    type: 'confirm',
    name: 'merge',
    message: 'Do you really want to deploy to production?',
    default: false
  };

  return inquirer.prompt([question]).then(function(answers) {
    if (answers.merge) {
      mergeMasterToProduction();
    }
  });
};
