'use strict';

const runCommandList = require('../utils/run-command-list');

const mergeMasterToProduction = async () => {
  console.log('> Merging master to production branch...');

  const commandList = [
    'git pull origin production',
    'git pull origin master',
    'git push origin master',
    'git push origin master:production'
  ];

  const commandRunResult = await runCommandList(commandList);

  if (!commandRunResult.success) {
    console.error(`! Error while merging master to production: ${commandRunResult.message}`);
    process.exit(1);
  }

  console.log('> Merge to production successful');
};

module.exports = mergeMasterToProduction;
