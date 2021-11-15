'use strict';

let Revision = require('./revision');

describe('Revision', function() {

  describe('#get', function() {
    it('should return defaultRevision if it is given', function() {
      let result = Revision.get(Revision.REVISION_TYPE_TIMESTAMP, 'test');

      expect(result).to.eql('test');
    });

    it('should return current time as revision if type is timestamp', function() {
      let clock = sinon.useFakeTimers(new Date('2017-01-13T12:5700Z').valueOf());
      let expectedRevision = Date.now();

      let result = Revision.get(Revision.REVISION_TYPE_TIMESTAMP);
      clock.restore();

      expect(result).to.eql(expectedRevision);
    });

    it('should return package version if type is package', function() {
      let expected = 'test';
      require('../../package.json').version = expected;

      let result = Revision.get(Revision.REVISION_TYPE_PACKAGE);

      expect(result).to.eql(expected);
    });
  });

  describe('#set', function() {
    it('should be able to set the revision manually', function() {
      let expectedRevision = 'test';
      Revision.set(expectedRevision);

      expect(Revision.get(Revision.REVISION_TYPE_TIMESTAMP)).to.eql(expectedRevision);

      Revision.set(undefined);
    });

    it('should return previously stored revision', function() {
      this.sandbox.spy(Math, 'round');

      Revision.get(Revision.REVISION_TYPE_TIMESTAMP);
      Revision.get(Revision.REVISION_TYPE_TIMESTAMP);

      expect(Math.round).to.have.callCount(1);
    });

  });
});
