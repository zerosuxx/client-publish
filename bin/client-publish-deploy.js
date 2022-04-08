#! /usr/bin/env node
'use strict';

const { Command, Option } = require('commander');

const Revision = require('../lib/utils/revision');
const ConfigProvider = require('../utils/config-provider');
const createTag = require('../lib/git/tag');
const deployToRedirector = require('../lib/deploy/redirector');
const deployToFirebase = require('../lib/deploy/firebase');
const configMap = require('../../config');

const program = new Command();
const usage = `[options]

Deploys assets to the given platforms

Example usage:
  $ client-publish deploy --target-env production --revision 4.2.0 --create-tag`;

const targetEnvOption = new Option('-e, --target-env <env>', 'the target environment the deployment is for');
const revisionOption = new Option('-r, --revision <revision>', 'the revision to use when deploying');
const createTagOption = new Option('-t, --create-tag', 'create a git tag for the new revision');

program
  .name('client-publish revision')
  .usage(usage)
  .addOption(targetEnvOption.choices(['staging', 'production']).default('staging').env('DEPLOY_ENV'))
  .addOption(revisionOption.default(null, 'current timestamp').env('PROJECT_REVISION'))
  .addOption(createTagOption.default(false))
  .parse(process.argv);

const deploy = async () => {
  const options = program.opts();
  const targetEnv = options.targetEnv || 'staging';
  const revision = options.revision || Revision.get(Revision.REVISION_TYPE.TIMESTAMP);
  const shouldCreateTag = !!options.tag;
  const config = new ConfigProvider(configMap, targetEnv);

  if (config.get('redirector.deploy')) {
    await deployToRedirector(config, revision, targetEnv);
  }

  if (config.get('firebase.deploy')) {
    await deployToFirebase(config, revision, targetEnv);
  }

  if (shouldCreateTag && targetEnv === 'staging') {
    await createTag(revision);
  }
};

deploy(program);
