#! /usr/bin/env node
'use strict';

const { Command, Option } = require('commander');

const Revision = require('../lib/utils/revision');

const modeList = [
  Revision.REVISION_TYPE_ENV, // env
  Revision.REVISION_TYPE_PACKAGE, // package
  Revision.REVISION_TYPE_TIMESTAMP, // timestamp
  Revision.REVISION_TYPE_GIT_TAG // git-tag
];

const program = new Command();
const usage = `[options]

Gets the current or next suggested revision for the project

Example usage:
  $ client-publish revision --mode git-tag --next`;

const modeOption = new Option('-m, --mode <mode>', 'the way to get the revision');
const nextOption = new Option('-n, --next', 'get the next revision based on conventional commit messages');

program
  .name('client-publish revision')
  .usage(usage)
  .addOption(modeOption.choices(modeList).default('timestamp'))
  .addOption(nextOption.default(false))
  .parse(process.argv);

const revision = async (program) => {
  const options = program.opts();
  const mode = options.mode;
  const next = options.next;

  if (!modeList.includes(mode)) {
    console.error(`! Invalid mode "${mode}". Mode must be (${modeList.join('|')}). Exiting.`);
    process.exit(1);
  }

  const revision = next ? await Revision.getNext(mode) : Revision.get(mode);
  console.log(revision);
};

revision(program);
