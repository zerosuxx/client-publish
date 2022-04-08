'use strict';

const request = require('superagent');
const Redirector = require('./redirector');
const ConfigProvider = require('../../utils/config-provider');

describe('Redirector', () => {
  let revision;
  let config;
  let expectedResult;
  let postStub;
  let sendStub;
  let setStub;
  let requestStub;

  beforeEach(() => {
    revision = 13;
    config = new ConfigProvider({}, 'staging');
    sinon.stub(config, 'get');
    config.get.withArgs('redirector.url').returns('https://test_url');
    config.get.withArgs('redirector.name').returns('test_name');
    config.get.withArgs('redirector.target').returns('test.target.com');
    config.get.withArgs('redirector.apiSecret').returns('test_api_secret');

    expectedResult = 'test_result';
    postStub = sinon.stub(request, 'post');
    sendStub = sinon.stub();
    setStub = sinon.stub();
    requestStub = { send: sendStub, set: setStub };

    for (let stub of [sendStub, postStub]) {
      stub.returns(requestStub);
    }

    setStub.onFirstCall().returns(requestStub);
    setStub.onCall(1).returns(Promise.resolve(expectedResult));
  });

  afterEach(() => {
    request.post.restore();
  });

  describe('#save', () => {

    it('should send request to the redirector service with the proper arguments', async () => {
      const result = await Redirector.save(config, revision);

      expect(postStub).to.be.calledWith('https://test_url/api/route');
      expect(sendStub).to.be.calledWith({ name: 'test_name', revision, target: 'test.target.com/' + revision });
      expect(setStub).to.have.calledWith('Accept', 'application/json');
      expect(setStub).to.have.calledWith('x-auth', 'test_api_secret');

      expect(result).to.eql(expectedResult);
    });

    it('should send request to the redirector service with project suffix when given', async () => {
      config.get.withArgs('projectName').returns('myProjectName');
      const result = await Redirector.save(config, revision);

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
