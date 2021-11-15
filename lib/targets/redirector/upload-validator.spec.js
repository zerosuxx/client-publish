'use strict';

const request = require('superagent');
const glob = require('glob');
const delay = require('@emartech/delay-js');

const UploadValidator = require('./upload-validator');

const uploadedFiles = [
  'dist/',
  'dist/index.html',
  'dist/index.css'
];

describe('UploadValidator', function() {

  describe('#validate', function() {
    let defaultConfig;

    beforeEach(function() {
      defaultConfig = {
        localDir: 'dist',
        validationWaitTime: 1000,
        redirector: {
          target: 'assets.emarsys.com'
        }
      };
    });

    it('should check first file by url', async function() {
      this.sandbox.stub(glob, 'sync').returns(uploadedFiles);
      this.sandbox.stub(request, 'get').resolves();
      this.sandbox.stub(delay, 'wait').resolves();

      const config = Object.assign({ projectName: 'test' }, defaultConfig);
      await UploadValidator.validate(config, 123);

      expect(request.get).to.have.been.calledWith('https://assets.emarsys.com/test/123/index.html');
    });

    it('should wait before checking the url', async function() {
      this.sandbox.stub(glob, 'sync').returns(uploadedFiles);
      this.sandbox.stub(request, 'get').resolves();
      this.sandbox.stub(delay, 'wait').resolves();

      const config = Object.assign({}, defaultConfig);
      await UploadValidator.validate(config, 123);

      expect(delay.wait).to.have.been.calledWith(1000);
    });
  });
});
