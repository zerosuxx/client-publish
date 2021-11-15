'use strict';

let s3 = require('@auth0/s3');
let EventEmitter = require('events');

let S3Wrapper = require('./s3-wrapper');
let Mimetype = require('../../utils/mimetype');

let config = require('../../../config');

describe('S3Wrapper', function() {

  describe('#publish', function() {
    let credentials;
    let uploadParameters;
    let expectedPrefix;
    let uploadDirEmitter;
    let uploadDirStub;
    let createClientStub;

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

      this.sandbox.stub(config.s3, 'credentials').value(credentials);
      this.sandbox.stub(config.s3, 'uploadParameters').value(uploadParameters);
    });


    it('should create upload directory promise with the proper parameters', function() {
      let clientStub = { uploadDir: uploadDirStub };
      clientStub.uploadDir.returns(uploadDirEmitter);
      createClientStub.returns(clientStub);

      let publisherPromise = S3Wrapper.publish(expectedPrefix);
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


    it('should use project name prefix if project name is provided', function() {
      this.sandbox.stub(config, 'projectName').value('myProjectName');
      expectedPrefix = 'myProjectName/42';
      const revision = 42;
      let clientStub = { uploadDir: uploadDirStub };
      clientStub.uploadDir.returns(uploadDirEmitter);
      createClientStub.returns(clientStub);

      let publisherPromise = S3Wrapper.publish(revision);
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
