'use strict';

const FirebaseConfigValidator = require('./firebase-config-validator');
const ConfigProvider = require('../../utils/config-provider');

describe('FirebaseConfigValidator', function() {

  describe('#validateConfig', function() {
    let config;

    beforeEach(function() {
      config = new ConfigProvider({}, 'staging');
      sinon.stub(config, 'get').returns('some-data');
    });

    it('should throw error if project name is missing', function() {
      config.get.withArgs('firebase.project').returns(false);

      const validationResult = FirebaseConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('FIREBASE_PROJECT is missing');
    });

    it('should throw error if firebase site is missing', function() {
      config.get.withArgs('firebase.site').returns(false);

      const validationResult = FirebaseConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('FIREBASE_SITE is missing');
    });

    it('should throw error if firebase site is missing', function() {
      config.get.withArgs('firebase.credentials').returns(false);

      const validationResult = FirebaseConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('GOOGLE_APPLICATION_CREDENTIALS_JSON is missing');
    });
  });
});
