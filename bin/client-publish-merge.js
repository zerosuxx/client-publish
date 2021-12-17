#! /usr/bin/env node
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const mergeMasterToProduction = require('../lib/git/merge');

program
  .option('-y --yes', 'automatic yes to prompt', false)
  .parse(process.argv);

const merge = async () => {
  const options = program.opts();
  const autoYes = options.yes;

  if (autoYes) {
    await mergeMasterToProduction();
    return;
  }

  const question = {
    type: 'confirm',
    name: 'merge',
    message: 'Do you really want to deploy to production?',
    default: false
  };

  const answers = await inquirer.prompt([question]);

  if (!answers.merge) {
    process.exit(1);
  }

  await mergeMasterToProduction();
};

merge(program);
