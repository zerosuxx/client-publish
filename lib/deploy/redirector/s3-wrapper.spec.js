'use strict';

const s3 = require('@auth0/s3');
const EventEmitter = require('events');

const S3Wrapper = require('./s3-wrapper');
const Mimetype = require('../../utils/mimetype');

describe('S3Wrapper', function() {

  describe('#publish', function() {
    let credentials;
    let uploadParameters;
    let expectedPrefix;
    let uploadDirEmitter;
    let uploadDirStub;
    let createClientStub;
    let defaultConfig;

    beforeEach(function() {
      credentials = {
        region: 'test_region',
        accessKeyId: 'test_access_key',
        secretAccessKey: 'test_secret_key'
      };
      uploadParameters = { Bucket: 'test-bucket' };
      expectedPrefix = 42;
      uploadDirEmitter = new EventEmitter();
      uploadDirStub = this.sandbox.stub();
      createClientStub = this.sandbox.stub(s3, 'createClient');
      defaultConfig = {
        localDir: 'dist',
        s3: {
          credentials,
          uploadParameters
        }
      };
    });


    it('should create upload directory promise with the proper parameters', function() {
      const clientStub = { uploadDir: uploadDirStub };
      clientStub.uploadDir.returns(uploadDirEmitter);
      createClientStub.returns(clientStub);

      const config = Object.assign({}, defaultConfig);
      const publisherPromise = S3Wrapper.publish(config, expectedPrefix);
      uploadDirEmitter.emit('end', 'alma');

      return publisherPromise.then((result) => {
        const expectedCreateClientParams = { s3Options: credentials };

        const expectedDirParams = {
          localDir: 'dist',
          s3Params: {
            Bucket: 'test-bucket',
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

      const config = Object.assign({ projectName: 'myProjectName' }, defaultConfig);
      let publisherPromise = S3Wrapper.publish(config, revision);
      uploadDirEmitter.emit('end', 'alma');

      return publisherPromise.then((result) => {
        let expectedCreateClientParams = { s3Options: credentials };

        let expectedDirParams = {
          localDir: 'dist',
          s3Params: {
            Bucket: 'test-bucket',
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
