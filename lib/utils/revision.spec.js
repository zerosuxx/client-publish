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
      let result = Revision.get(Revision.REVISION_TYPE_TIMESTAMP, 'test');

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

        let result = Revision.get(Revision.REVISION_TYPE_TIMESTAMP);

        expect(result).to.eql(expectedRevision);
      });
    });

    context('with package', () => {
      beforeEach(() => {
        sinon.stub(process, 'cwd').returns('current-folder');

        const readFileSyncStub = sinon.stub(fs, 'readFileSync');
        readFileSyncStub.returns('{ "version": "bad-version" }');
        readFileSyncStub.withArgs('current-folder/package.json').returns('{ "version": "test-version" }');
      });

      afterEach(() => {
        process.cwd.restore();
        fs.readFileSync.restore();
      });

      it('should return package version if type is package', () => {
        let result = Revision.get(Revision.REVISION_TYPE_PACKAGE);

        expect(result).to.eql('test-version');
      });
    });

    context('with enviroment', () => {
      let envStub;

      beforeEach(() => {
        envStub = sinon.stub(process, 'env').value({
          PROJECT_REVISION: 'env-test'
        });
      });

      afterEach(() => {
        envStub.restore();
      });

      it('should return revision from env if type is env', () => {
        let result = Revision.get(Revision.REVISION_TYPE_ENV);

        expect(result).to.eql('env-test');
      });
    });
  });

  describe('#set', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers(10 * 1e3);
    });

    afterEach(() => {
      clock.restore();
    });

    it('should be able to set the revision manually', () => {
      let expectedRevision = 'revision-set-test';
      Revision.set(expectedRevision);

      let result = Revision.get(Revision.REVISION_TYPE_TIMESTAMP);
      expect(result).to.eql(expectedRevision);
    });

    it('should return previously stored revision', () => {
      let result;

      result = Revision.get(Revision.REVISION_TYPE_TIMESTAMP);
      clock.tick(1e3);
      result = Revision.get(Revision.REVISION_TYPE_TIMESTAMP);

      expect(result).to.eql(10);
    });

  });
});
