'use strict';

const s3 = require('@auth0/s3');
const EventEmitter = require('events');

const S3Wrapper = require('./s3-wrapper');
const Mimetype = require('../../utils/mimetype');
const ConfigProvider = require('../../utils/config-provider');

describe('S3Wrapper', function() {

  describe('#publish', function() {
    let credentials;
    let uploadParameters;
    let expectedPrefix;
    let uploadDirEmitter;
    let uploadDirStub;
    let createClientStub;
    let config;

    beforeEach(function() {
      credentials = {
        region: 'test_region',
        accessKeyId: 'test_access_key',
        secretAccessKey: 'test_secret_key'
      };
      uploadParameters = {
        Bucket: 'test-bucket',
        ACL: 'test-acl',
        CacheControl: 'test-cache-control'
      };
      expectedPrefix = 42;
      uploadDirEmitter = new EventEmitter();
      uploadDirStub = this.sandbox.stub();
      createClientStub = this.sandbox.stub(s3, 'createClient');

      config = new ConfigProvider({}, 'staging');
      sinon.stub(config, 'get');
      config.get.withArgs('localDir').returns('dist');
      config.get.withArgs('s3.credentials.region').returns(credentials.region);
      config.get.withArgs('s3.credentials.accessKeyId').returns(credentials.accessKeyId);
      config.get.withArgs('s3.credentials.secretAccessKey').returns(credentials.secretAccessKey);
      config.get.withArgs('s3.uploadParameters.Bucket').returns(uploadParameters.Bucket);
      config.get.withArgs('s3.uploadParameters.ACL').returns(uploadParameters.ACL);
      config.get.withArgs('s3.uploadParameters.CacheControl').returns(uploadParameters.CacheControl);
    });


    it('should create upload directory promise with the proper parameters', function() {
      const clientStub = { uploadDir: uploadDirStub };
      clientStub.uploadDir.returns(uploadDirEmitter);
      createClientStub.returns(clientStub);

      const publisherPromise = S3Wrapper.publish(config, expectedPrefix);
      uploadDirEmitter.emit('end', 'alma');

      return publisherPromise.then((result) => {
        const expectedCreateClientParams = { s3Options: credentials };

        const expectedDirParams = {
          localDir: 'dist',
          s3Params: {
            Bucket: 'test-bucket',
            ACL: 'test-acl',
            CacheControl: 'test-cache-control',
            Prefix: expectedPrefix
          },
          getS3Params: Mimetype.getWithCharset
        };

        expect(uploadDirStub).to.have.been.calledWith(expectedDirParams);
        expect(createClientStub).to.have.been.calledWith(expectedCreateClientParams);
        expect(result).to.eql('alma');
      });
    });


    it('should use project name prefix if project name is provided', function() {
      expectedPrefix = 'myProjectName/42';
      const revision = 42;
      let clientStub = { uploadDir: uploadDirStub };
      clientStub.uploadDir.returns(uploadDirEmitter);
      createClientStub.returns(clientStub);

      config.get.withArgs('projectName').returns('myProjectName');

      let publisherPromise = S3Wrapper.publish(config, revision);
      uploadDirEmitter.emit('end', 'alma');

      return publisherPromise.then((result) => {
        let expectedCreateClientParams = { s3Options: credentials };

        let expectedDirParams = {
          localDir: 'dist',
          s3Params: {
            Bucket: 'test-bucket',
            ACL: 'test-acl',
            CacheControl: 'test-cache-control',
            Prefix: expectedPrefix
          },
          getS3Params: Mimetype.getWithCharset
        };

        expect(uploadDirStub).to.have.been.calledWith(expectedDirParams);
        expect(createClientStub).to.have.been.calledWith(expectedCreateClientParams);
        expect(result).to.eql('alma');
      });
    });

  });
});
