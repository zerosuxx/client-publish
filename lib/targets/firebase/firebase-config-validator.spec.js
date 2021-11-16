'use strict';

const FirebaseConfigValidator = require('./firebase-config-validator');

describe('FirebaseConfigValidator', function() {

  describe('#validateConfig', function() {
    let config;

    beforeEach(function() {
      config = {
        firebase: {
          project: 'test-project',
          site: 'project-name',
          accessToken: 'test-access-token'
        }
      };
    });

    it('should throw error if project name is missing', function() {
      config.firebase.project = false;

      const validationResult = FirebaseConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('FIREBASE_PROJECT is missing');
    });

    it('should throw error if firebase site is missing', function() {
      config.firebase.site = false;

      const validationResult = FirebaseConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('PROJECT_NAME or FIREBASE_SITE is missing');
    });

    it('should throw error if firebase access token is missing', function() {
      config.firebase.accessToken = false;

      const validationResult = FirebaseConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('FIREBASE_TOKEN is missing');
    });

    it('should check PROJECT_NAME is included in current directory', function() {
      config.firebase.site = 'random';

      const validationResult = FirebaseConfigValidator.validateConfig(config);

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('Current directory does not contain PROJECT_NAME');
    });
  });
});
