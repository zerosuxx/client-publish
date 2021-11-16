'use strict';

const request = require('superagent');
const delay = require('@emartech/delay-js');

const UploadValidator = require('./upload-validator');
const NotImplementedError = require('./not-implemented-error');

describe('UploadValidator', () => {

  describe('#validateUpload', () => {
    let defaultConfig;

    beforeEach(() => {
      sinon.stub(delay, 'wait').resolves();
    });

    afterEach(() => {
      delay.wait.restore();
    });

    it('should throw an error if the class is not extended', () => {
      expect(UploadValidator.validateUpload()).to.eventually.throw(NotImplementedError);
    });

    context('validationWaitTime', () => {
      beforeEach(() => {
        defaultConfig = {
          validationWaitTime: 1000
        };

        sinon.stub(request, 'get').resolves();
      });

      afterEach(() => {
        request.get.restore();
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

    context('upload failed', () => {
      beforeEach(() => {
        defaultConfig = {};
        sinon.stub(request, 'get').rejects({ message: 'Test Error' });
      });

      afterEach(() => {
        request.get.restore();
      });

      it('should isValid:false if uploaded file does not exist', async () => {
        class FakeInvalidUploadValidator extends UploadValidator {
          static _getFirstUploadedFileUrl() { return ''; }
        }

        const config = Object.assign({}, defaultConfig);
        const validationResult = await FakeInvalidUploadValidator.validateUpload(config, 123);

        expect(validationResult.isValid).to.eql(false);
        expect(validationResult.message).to.eql('Test Error');
      });
    });

    context('upload successful', () => {
      beforeEach(() => {
        defaultConfig = {};
        sinon.stub(request, 'get').resolves();
      });

      afterEach(() => {
        request.get.restore();
      });

      it('should isValid:true if uploaded file does not exist', async () => {
        class FakeValidUploadValidator extends UploadValidator {
          static _getFirstUploadedFileUrl() { return ''; }
        }

        const config = Object.assign({}, defaultConfig);
        const validationResult = await FakeValidUploadValidator.validateUpload(config, 123);

        expect(validationResult.isValid).to.eql(true);
      });
    });
  });
});
