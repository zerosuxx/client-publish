'use strict';

let request = require('superagent');
let Redirector = require('./redirector');
let config = require('../config');

describe('Redirector', function() {
  let revision;

  beforeEach(function() {
    revision = 13;
  });

  describe('#save', function() {

    it('should send request to the redirector service with the proper arguments', function*() {
      let expectedResult = 'test_result';

      let postStub = this.sandbox.stub(request, 'post');
      let sendStub = this.sandbox.stub();
      let setStub = this.sandbox.stub();
      let requestStub = { send: sendStub, set: setStub};

      for( let stub of [sendStub, postStub]) {
        stub.returns(requestStub);
      }
      setStub.onFirstCall().returns(requestStub);
      setStub.onCall(1).resolves(expectedResult);

      let redirectorConfigMock = {
        url: 'https://test_url',
        name: 'test_name',
        revision,
        target: 'test_target',
        apiSecret: 'test_api_secret'
      };
      this.sandbox.stub(config, 'redirector', redirectorConfigMock);

      let result = yield Redirector.save(revision);

      expect(postStub).to.be.calledWith('https://test_url/api/route');
      expect(sendStub).to.be.calledWith({ name: 'test_name', revision, target: 'test_target/' + revision });
      expect(setStub).to.have.calledWith('Accept', 'application/json');
      expect(setStub).to.have.calledWith('x-auth', 'test_api_secret');

      expect(result).to.eql(expectedResult);
    });
  });
});
