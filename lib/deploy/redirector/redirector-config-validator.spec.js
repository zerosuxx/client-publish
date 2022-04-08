'use strict';

const RedirectorConfigValidator = require('./redirector-config-validator');
const ConfigProvider = require('../../utils/config-provider');

describe('RedirectorConfigValidator', function() {

  describe('#validateConfig', function() {
    let config;

    beforeEach(function() {
      config = new ConfigProvider({}, 'staging');
      sinon.stub(config, 'get').returns('some-data');
    });

    it('should throw error if name is missing', function() {
      config.get.withArgs('redirector.name').returns(false);

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('PROJECT_NAME or REDIRECTOR_NAME is missing');
    });

    it('should throw error if apiSecret is missing', function() {
      config.get.withArgs('redirector.apiSecret').returns(false);

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('REDIRECTOR_API_SECRET is missing');
    });

    it('should throw error if accessKeyId is missing', function() {
      config.get.withArgs('s3.credentials.accessKeyId').returns(false);

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('AWS_ACCESS_KEY_ID is missing');
    });

    it('should throw error if secretAccessKey is missing', function() {
      config.get.withArgs('s3.credentials.secretAccessKey').returns(false);

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('AWS_SECRET_ACCESS_KEY is missing');
    });

    it('should check PROJECT_NAME is included in current directory', function() {
      config.get.withArgs('projectHasCustomName').returns(false);
      config.get.withArgs('redirector.name').returns('random');

      const validationResult = RedirectorConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('Current directory does not contain PROJECT_NAME');
    });
  });
});
