#! /usr/bin/env node
'use strict';

const { Command, Option } = require('commander');
const inquirer = require('inquirer');

const mergeMasterToProduction = require('../lib/git/merge');

const program = new Command();
const usage = `[options]

Merges the \`master\` branch into the \`production\` branch

Example usage:
  $ client-publish merge --yes`;

const autoYesOption = new Option('-y, --yes', 'automatic yes to prompt');

program
  .name('client-publish merge')
  .usage(usage)
  .addOption(autoYesOption.default(false))
  .parse(process.argv);

const merge = async (program) => {
  const options = program.opts();
  const autoYes = !!options.yes;

  if (!autoYes) {
    const answers = await inquirer.prompt([{
      type: 'confirm',
      name: 'merge',
      message: 'Do you really want to deploy to production?',
      default: false
    }]);

    if (!answers.merge) {
      process.exit(1);
    }
  }

  await mergeMasterToProduction();
};

merge(program);
