#! /usr/bin/env node
'use strict';

const { Command, Option } = require('commander');

const Revision = require('../lib/utils/revision');
const typeList = Object.values(Revision.REVISION_TYPE);

const program = new Command();
const usage = `[options]

Gets the current or next suggested revision for the project

Example usage:
  $ client-publish revision --type git-tag --next`;

const typeOption = new Option('-t, --type <type>', 'the way to get the revision');
const nextOption = new Option('-n, --next', 'get the next revision based on conventional commit messages');

program
  .name('client-publish revision')
  .usage(usage)
  .addOption(typeOption.choices(typeList).default('timestamp'))
  .addOption(nextOption.default(false))
  .parse(process.argv);

const revision = async (program) => {
  const options = program.opts();
  const type = options.type;
  const next = options.next;

  if (!typeList.includes(type)) {
    console.error(`! Invalid type "${type}". Type must be (${typeList.join('|')}). Exiting.`);
    process.exit(1);
  }

  const revision = next ? await Revision.getNext(type) : Revision.get(type);
  console.log(revision);
};

revision(program);
