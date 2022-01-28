'use strict';

const runCommandList = require('../utils/run-command-list');

const createTag = async (revision) => {
  console.log(`> Creating Git tag with revision "${revision}"...`);

  const commandList = [
    `git tag ${revision}`,
    'git push --tags'
  ];

  if (!revision) {
    console.error('! Missing revision. Exiting.');
    process.exit(1);
  }

  const commandRunResult = await runCommandList(commandList);

  if (!commandRunResult.success) {
    console.error(`! Error while creating new git tag "${revision}". ${commandRunResult.message}. Exiting.`);
    process.exit(1);
  }

  console.log('> Git tag creation successful');
};

module.exports = createTag;
