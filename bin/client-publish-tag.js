#! /usr/bin/env node
'use strict';

const program = require('commander');
const inquirer = require('inquirer');
const Revision = require('../lib/utils/revision');
const createTag = require('../lib/git/tag');

program
  .option('-r --revision [revision]', 'the revision to use (default: PROJECT_REVISION)')
  .option('-p --prefix [prefix]', 'the prefix to add to the version number')
  .option('-y --yes', 'automatic yes to prompt', false)
  .parse(process.argv);

const tag = async (program) => {
  const options = program.opts();
  const revision = options.revision || Revision.get(Revision.REVISION_TYPE_ENV);
  const prefix = options.prefix || '';
  const autoYes = options.yes;
  const newTag = `${prefix}${revision}`;

  if (autoYes) {
    await createTag(newTag);
    return;
  }

  const question = {
    type: 'confirm',
    name: 'tag',
    message: `Do you really want to create a new git tag ${newTag}?`,
    default: false
  };

  const answers = await inquirer.prompt([question]);

  if (!answers.tag) {
    process.exit(1);
  }

  await createTag(newTag);
};

tag(program);
