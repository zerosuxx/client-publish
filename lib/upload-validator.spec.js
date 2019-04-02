'use strict';

const request = require('superagent');
const glob = require('glob');
const UploadValidator = require('./upload-validator');
const config = require('../config');
const delay = require('@emartech/delay-js');

const uploadedFiles = [
  'dist/',
  'dist/index.html',
  'dist/index.css'
];

describe('UploadValidator', function() {
  it('should check first file by url', async function() {
    this.sandbox.stub(glob, 'sync').returns(uploadedFiles);
    this.sandbox.stub(config, 'projectName').value('test');
    this.sandbox.stub(request, 'get').resolves();
    this.sandbox.stub(delay, 'wait').resolves();

    await UploadValidator.validate(123);

    expect(request.get).to.have.been.calledWith('https://assets.emarsys.com/test/123/index.html');
  });

  it('should wait bfore checking the url', async function() {
    this.sandbox.stub(glob, 'sync').returns(uploadedFiles);
    this.sandbox.stub(request, 'get').resolves();
    this.sandbox.stub(delay, 'wait').resolves();

    await UploadValidator.validate(123);

    expect(delay.wait).to.have.been.calledWith(1000);
  });
});
