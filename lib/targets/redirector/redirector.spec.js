'use strict';

const request = require('superagent');
const Redirector = require('./redirector');

describe('Redirector', function() {
  let revision;
  let defaultConfig;
  let expectedResult;
  let postStub;
  let sendStub;
  let setStub;
  let requestStub;

  beforeEach(function() {
    revision = 13;
    defaultConfig = {
      redirector: {
        url: 'https://test_url',
        name: 'test_name',
        revision,
        target: 'test.target.com',
        apiSecret: 'test_api_secret'
      }
    };

    expectedResult = 'test_result';
    postStub = this.sandbox.stub(request, 'post');
    sendStub = this.sandbox.stub();
    setStub = this.sandbox.stub();
    requestStub = { send: sendStub, set: setStub };

    for (let stub of [sendStub, postStub]) {
      stub.returns(requestStub);
    }

    setStub.onFirstCall().returns(requestStub);
    setStub.onCall(1).returns(Promise.resolve(expectedResult));
  });

  describe('#save', function() {

    it('should send request to the redirector service with the proper arguments', function*() {
      const config = Object.assign({}, defaultConfig);
      const result = yield Redirector.save(config, revision);

      expect(postStub).to.be.calledWith('https://test_url/api/route');
      expect(sendStub).to.be.calledWith({ name: 'test_name', revision, target: 'test.target.com/' + revision });
      expect(setStub).to.have.calledWith('Accept', 'application/json');
      expect(setStub).to.have.calledWith('x-auth', 'test_api_secret');

      expect(result).to.eql(expectedResult);
    });

    it('should send request to the redirector service with project suffix when given', function*() {
      const config = Object.assign({ projectName: 'myProjectName' }, defaultConfig);
      const result = yield Redirector.save(config, revision);

      expect(postStub).to.be.calledWith('https://test_url/api/route');
      expect(sendStub).to.be.calledWith({
        name: 'test_name',
        revision,
        target: 'test.target.com/myProjectName/' + revision
      });
      expect(setStub).to.have.calledWith('Accept', 'application/json');
      expect(setStub).to.have.calledWith('x-auth', 'test_api_secret');

      expect(result).to.eql(expectedResult);
    });
  });
});
