'use strict';

const FirebaseConfigValidator = require('./firebase-config-validator');

describe('FirebaseConfigValidator', function() {

  describe('#validateConfig', function() {
    let config;

    beforeEach(function() {
      config = {
        firebase: {
          project: 'test-project',
          site: 'project-name'
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
      expect(validationResult.message).to.eql('FIREBASE_SITE is missing');
    });
  });
});
