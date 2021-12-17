#! /usr/bin/env node
'use strict';

const program = require('commander');
const Revision = require('../lib/utils/revision');

program
  .option('-m --mode <mode>', 'the way to get the revision (env|package|timestamp)', 'timestamp')
  .parse(process.argv);

const revision = async (program) => {
  const options = program.opts();
  const mode = options.mode;

  const modeMap = {
    env: Revision.REVISION_TYPE_ENV,
    package: Revision.REVISION_TYPE_PACKAGE,
    timestamp: Revision.REVISION_TYPE_TIMESTAMP
  };

  if (!Object.keys(modeMap).includes(mode)) {
    console.log(`! Invalid mode "${mode}". Mode must be (env|package|timestamp). Exiting.`);
    process.exit(1);
  }

  const revision = Revision.get(modeMap[mode]);
  console.log(revision);
};

revision(program);
