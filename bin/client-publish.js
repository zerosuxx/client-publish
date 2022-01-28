#!/usr/bin/env node
'use strict';

const { Command } = require('commander');

const program = new Command();
const usage = `<command> [options]

Deployer for Emarsys client side projects

Example usage:
  $ REVISION=\`client-publish revision --mode git-tag --next\`
  $ client-publish deploy --revision $REVISION --tag --target-env production`;

program
  .name('client-publish')
  .usage(usage)
  .command('deploy', 'Deploys assets to the given platforms').alias('d')
  .command('revision', 'Gets the current or next suggested revision for the project').alias('r')
  .command('merge', 'Merges the `master` branch into the `production` branch').alias('m')
  .command('tag', 'Creates a new git tag for the project with a given revision').alias('t')
  .parse(process.argv);
