'use strict';

const process = require('process');
const fs = require('fs');
const Revision = require('./revision');

describe('Revision', () => {
  beforeEach(() => {
    Revision.set(undefined);
  });

  describe('#get', () => {
    it('should return defaultRevision if it is given', () => {
      let result = Revision.get(Revision.REVISION_TYPE.TIMESTAMP, 'test');
      expect(result).to.eql('test');
    });

    context('with timestamp', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers(new Date('2017-01-13T12:5700Z').valueOf());
      });

      afterEach(() => {
        clock.restore();
      });

      it('should return current time as revision if type is timestamp', () => {
        let expectedRevision = Date.now();

        let result = Revision.get(Revision.REVISION_TYPE.TIMESTAMP);
        expect(result).to.eql(expectedRevision);
      });
    });

    context('with package', () => {
      let readFileSyncStub;

      beforeEach(() => {
        sinon.stub(process, 'cwd').returns('current-folder');

        readFileSyncStub = sinon.stub(fs, 'readFileSync');
        readFileSyncStub.returns('{ "version": "bad-version" }');
      });

      afterEach(() => {
        process.cwd.restore();
        fs.readFileSync.restore();
      });

      it('should return package version if type is package', () => {
        readFileSyncStub.withArgs('current-folder/package.json').returns('{ "version": "test-version" }');

        let result = Revision.get(Revision.REVISION_TYPE.PACKAGE);
        expect(result).to.eql('test-version');
      });
    });

    context('with enviroment', () => {
      let envStub;

      beforeEach(() => {
        envStub = sinon.stub(process, 'env');
      });

      afterEach(() => {
        envStub.restore();
      });

      it('should return revision from env if type is env', () => {
        envStub.value({ PROJECT_REVISION: 'env-test' });

        let result = Revision.get(Revision.REVISION_TYPE.ENV);
        expect(result).to.eql('env-test');
      });
    });
  });

  describe('#set', () => {
    const SECOND = 1000;
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(10 * SECOND);
    });

    afterEach(() => {
      clock.restore();
    });

    it('should be able to set the revision manually', () => {
      let expectedRevision = 'revision-set-test';
      Revision.set(expectedRevision);

      let result = Revision.get(Revision.REVISION_TYPE.TIMESTAMP);
      expect(result).to.eql(expectedRevision);
    });

    it('should return previously stored revision', () => {
      let result;

      result = Revision.get(Revision.REVISION_TYPE.TIMESTAMP);
      clock.tick(SECOND);
      result = Revision.get(Revision.REVISION_TYPE.TIMESTAMP);

      expect(result).to.eql(10);
    });

  });
});
