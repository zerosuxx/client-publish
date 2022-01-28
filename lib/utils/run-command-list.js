'use strict';

let childProcess = require('child-process-promise');

const runCommandList = async (commandList) => {
  const commandString = commandList.join(' && ');

  try {
    const runResult = await childProcess.exec(commandString); // eslint-disable-line security/detect-child-process

    if (runResult.childProcess.exitCode > 0) {
      throw new Error(runResult.stderr);
    }

    return { success: true };
  } catch (error) {
    return { success: false, commandString, message: error.message };
  }
};

module.exports = runCommandList;
