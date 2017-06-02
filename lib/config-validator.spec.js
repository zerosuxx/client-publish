'use strict';

const ConfigValidator = require('./config-validator');

describe('ConfigValidator', function() {

  describe('#checkValues', function() {
    let config;

    beforeEach(function() {
      config = {
        redirector: {
          name: 'redirector-name',
          apiSecret: 'redirector-apiSecret'
        },
        s3: {
          credentials: {
            accessKeyId: 'test-accessKeyId',
            secretAccessKey: 'test-secretAccessKey'
          }
        }
      };
    });

    let expectError = function (config, errorMessage) {
      try {
        ConfigValidator.checkValues(config);
        throw new Error('should throw');
      } catch (err) {
        expect(err.message).to.eql(errorMessage);
      }
    };

    it('should throw error if name is missing', function() {
      config.redirector.name = false;

      expectError(config, 'PROJECT_NAME is missing');
    });

    it('should throw error if apiSecret is missing', function() {
      config.redirector.apiSecret = false;

      expectError(config, 'REDIRECTOR_API_SECRET is missing');
    });

    it('should throw error if accessKeyId is missing', function() {
      config.s3.credentials.accessKeyId = false;

      expectError(config, 'AWS_ACCESS_KEY_ID is missing');
    });

    it('should throw error if secretAccessKey is missing', function() {
      config.s3.credentials.secretAccessKey = false;

      expectError(config, 'AWS_SECRET_ACCESS_KEY is missing');
    });

    it('should check PROJECT_NAME is included in current directory', function() {
      config.redirector.name = 'random';

      expectError(config, 'Current directory does not contain PROJECT_NAME');
    });
  });
});
