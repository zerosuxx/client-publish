'use strict';

const ConfigValidator = require('./config-validator');
const NotImplementedError = require('./not-implemented-error');

describe('ConfigValidator', () => {

  describe('#isConfigValid', () => {
    it('should throw an error if the class is not extended', () => {
      expect(ConfigValidator.validateConfig).to.throw(NotImplementedError);
    });

    it('should return false if checkValues throws and error', () => {
      class FakeInvalidConfigValidator extends ConfigValidator {
        static _checkValues() { throw new Error('Test Error'); }
      }

      const validationResult = FakeInvalidConfigValidator.validateConfig();

      expect(validationResult.isValid).to.eql(false);
      expect(validationResult.message).to.eql('Test Error');
    });

    it('should return true if checkValues does not throw an error', () => {
      class FakeValidConfigValidator extends ConfigValidator {
        static _checkValues() { return; }
      }

      const validationResult = FakeValidConfigValidator.validateConfig();

      expect(validationResult.isValid).to.eql(true);
    });
  });
});
