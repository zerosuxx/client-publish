#!/usr/bin/env node
'use strict';

const program = require('commander');

// Script description
program
  .description('Deployer for client side projects.')
  .usage('<command> [options]')
  .command('deploy', 'Deploy assets').alias('d')
  .command('revision', 'Check current revision').alias('r')
  .command('merge', 'Merge master branch to production').alias('m')
  .command('tag', 'Create new git tag').alias('t')
  .parse(process.argv);
