'use strict';

let runCommandList = require('./run-command-list');

describe('runCommandList', function() {
  it('should return success:false if cannot execute a single command', async () => {
    const runResult = await runCommandList(['false']);
    expect(runResult.success).to.eql(false);
  });

  it('should return success:true if successfully executes a single command', async () => {
    const runResult = await runCommandList(['true']);
    expect(runResult.success).to.eql(true);
  });

  it('should return success:true if successfully executes all given commands', async () => {
    const runResult = await runCommandList(['true', 'true', 'true']);
    expect(runResult.success).to.eql(true);
  });

  it('should return success:false if any of the given commands fail', async () => {
    const runResult = await runCommandList(['true', 'true', 'false', 'true']);
    expect(runResult.success).to.eql(false);
  });

  it('should return the executed command list on failure', async () => {
    const runResult = await runCommandList(['true', 'true', 'false', 'true']);
    expect(runResult.commandString).to.eql('true && true && false && true');
  });
});
