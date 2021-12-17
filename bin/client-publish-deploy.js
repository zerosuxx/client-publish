#! /usr/bin/env node
'use strict';

const program = require('commander');
const config = require('../config');
const createTag = require('../lib/git/tag');
const Revision = require('../lib/utils/revision');
const deployToRedirector = require('../lib/deploy/redirector');
const deployToFirebase = require('../lib/deploy/firebase');

program
  .option('-e --target-env <env>', 'the target environment to deploy to (staging|production)', process.env.DEPLOY_ENV)
  .option('-r --revision <revision>', 'the revision to use when deploying', process.env.PROJECT_REVISION)
  .option('-t --tag', 'also create a git tag for the new revision')
  .parse(process.argv);

const deploy = async () => {
  const options = program.opts();
  const target = options.target || 'staging';
  const revision = options.revision || Revision.get(Revision.REVISION_TYPE_TIMESTAMP);
  const shouldCreateTag = !!options.tag;

  if (config.deployTargets.includes('redirector')) {
    await deployToRedirector(config, revision, target);
  }

  if (config.deployTargets.includes('firebase')) {
    await deployToFirebase(config, revision, target);
  }

  if (shouldCreateTag && target === 'staging') {
    await createTag(revision);
  }
};

deploy(program);
