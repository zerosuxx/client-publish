#! /usr/bin/env node
'use strict';

const program = require('commander');
const Revision = require('../lib/utils/revision');

const modeList = [
  Revision.REVISION_TYPE_ENV, // env
  Revision.REVISION_TYPE_PACKAGE, // package
  Revision.REVISION_TYPE_TIMESTAMP, // timestamp
  Revision.REVISION_TYPE_GIT_TAG // git-tag
];

program
  .option('-m --mode <mode>', `the way to get the revision (${modeList.join('|')})`, 'timestamp')
  .parse(process.argv);

const revision = async (program) => {
  const options = program.opts();
  const mode = options.mode;

  const revision = getCurrentRevision(mode);
  console.log(revision);
};

const getCurrentRevision = (mode) => {
  if (!modeList.includes(mode)) {
    console.log(`! Invalid mode "${mode}". Mode must be (${modeList.join('|')}). Exiting.`);
    process.exit(1);
  }

  return Revision.get(mode);
};

revision(program);
