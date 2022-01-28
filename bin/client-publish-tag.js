#! /usr/bin/env node
'use strict';

const { Command, Option } = require('commander');
const inquirer = require('inquirer');

const Revision = require('../lib/utils/revision');
const createTag = require('../lib/git/tag');

const program = new Command();
const usage = `[options]

Creates a new git tag for the project with a given revision

Example usage:
  $ client-publish tag --revision 4.2.0 --prefix "v" --yes`;

const revisionOption = new Option('-r, --revision [revision]', 'the revision to use for the tag');
const prefixOption = new Option('-p, --prefix [prefix]', 'the prefix to add to the version number');
const autoYesOption = new Option('-y, --yes', 'automatic yes to prompt');

program
  .name('client-publish tag')
  .usage(usage)
  .addOption(revisionOption.env('PROJECT_REVISION'))
  .addOption(prefixOption.default(''))
  .addOption(autoYesOption.default(false))
  .parse(process.argv);

const tag = async (program) => {
  const options = program.opts();
  const revision = options.revision || Revision.get(Revision.REVISION_TYPE_ENV);
  const prefix = options.prefix || '';
  const autoYes = !!options.yes;
  const newTag = `${prefix}${revision}`;

  if (!autoYes) {
    const answers = await inquirer.prompt([{
      type: 'confirm',
      name: 'tag',
      message: `Do you really want to create a new git tag ${newTag}?`,
      default: false
    }]);

    if (!answers.tag) {
      process.exit(1);
    }
  }

  await createTag(newTag);
};

tag(program);
