'use strict';

const request = require('superagent');
const glob = require('glob');
const delay = require('@emartech/delay-js');

const RedirectorUploadValidator = require('./redirector-upload-validator');

const localFiles = [
  'dist/',
  'dist/index.html',
  'dist/index.css'
];

describe('RedirectorUploadValidator', function() {

  describe('#validateUpload', function() {
    let defaultConfig;

    beforeEach(() => {
      defaultConfig = {
        localDir: 'dist',
        projectName: 'test',
        redirector: {
          target: 'assets.emarsys.com'
        }
      };

      sinon.stub(glob, 'sync').returns(localFiles);
      sinon.stub(request, 'get').resolves();
      sinon.stub(delay, 'wait').resolves();
    });

    afterEach(() => {
      request.get.restore();
      delay.wait.restore();
    });

    it('should check first file by url', async function() {
      const config = Object.assign({}, defaultConfig);
      await RedirectorUploadValidator.validateUpload(config, 123);

      expect(request.get).to.have.been.calledWith('https://assets.emarsys.com/test/123/index.html');
    });
  });
});
