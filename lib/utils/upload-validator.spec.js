'use strict';

const request = require('superagent');
const delay = require('@emartech/delay-js');

const UploadValidator = require('./upload-validator');
const NotImplementedError = require('./not-implemented-error');

describe('UploadValidator', () => {

  describe('#validateUpload', () => {
    let defaultConfig;

    beforeEach(() => {
      defaultConfig = {
        validationWaitTime: 1000
      };

      sinon.stub(request, 'get').resolves();
      sinon.stub(delay, 'wait').resolves();
    });

    afterEach(() => {
      request.get.restore();
      delay.wait.restore();
    });

    it('should throw an error if the class is not extended', () => {
      expect(UploadValidator.validateUpload).to.throw(NotImplementedError);
    });

    it('should wait before checking the url', async () => {
      class FakeUploadValidator extends UploadValidator {
        static _getFirstUploadedFileUrl() { return ''; }
      }

      const config = Object.assign({}, defaultConfig);
      await FakeUploadValidator.validateUpload(config, 123);

      expect(delay.wait).to.have.been.calledWith(1000);
    });
  });
});
