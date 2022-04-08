'use strict';

const Revision = require('../utils/revision');
const ConfigProvider = require('../utils/config-provider');

const deployToRedirector = require('../deploy/redirector');
const deployToFirebase = require('../deploy/firebase');
const mergeMasterToProduction = require('../git/merge');

const targetEnv = process.env.DEPLOY_ENV || 'staging';
const configMap = require('../../config');
const config = new ConfigProvider(configMap, targetEnv);

const argv = require('yargs').argv;
const inquirer = require('inquirer');

module.exports.deploy = function() {
  const revision = Revision.get(Revision.REVISION_TYPE.TIMESTAMP, argv.revision);

  this.deployWithRevision(revision);
};

module.exports.deployWithRevision = async function(revision) {
  const deployments = [];

  if (config.get('redirector.deploy')) {
    const redirectorDeployment = deployToRedirector(config, revision);
    deployments.push(redirectorDeployment);
  }

  if (config.get('firebase.deploy')) {
    const firebaseDeployment = deployToFirebase(config, revision);
    deployments.push(firebaseDeployment);
  }

  return Promise.all(deployments);
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
