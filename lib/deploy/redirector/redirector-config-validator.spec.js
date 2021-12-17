'use strict';

const RedirectorConfigValidator = require('./redirector-config-validator');

describe('RedirectorConfigValidator', function() {

  describe('#validateConfig', function() {
    let config;

    beforeEach(function() {
      config = {
        redirector: { name: 'redirector-name', apiSecret: 'redirector-apiSecret' },
        s3: {
          credentials: { accessKeyId: 'test-accessKeyId', secretAccessKey: 'test-secretAccessKey' }
        }
      };
    });

    it('should throw error if name is missing', function() {
      config.redirector.name = false;

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('PROJECT_NAME or REDIRECTOR_NAME is missing');
    });

    it('should throw error if apiSecret is missing', function() {
      config.redirector.apiSecret = false;

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('REDIRECTOR_API_SECRET is missing');
    });

    it('should throw error if accessKeyId is missing', function() {
      config.s3.credentials.accessKeyId = false;

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('AWS_ACCESS_KEY_ID is missing');
    });

    it('should throw error if secretAccessKey is missing', function() {
      config.s3.credentials.secretAccessKey = false;

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('AWS_SECRET_ACCESS_KEY is missing');
    });

    it('should check PROJECT_NAME is included in current directory', function() {
      config.redirector.name = 'random';

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('Current directory does not contain PROJECT_NAME');
    });
  });
});
