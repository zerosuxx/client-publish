'use strict';

const mockFS = require('mock-fs');
const Mimetype = require('./mimetype');

describe('Mimetype', function() {
  let fileMock = {
    'test.txt': 'content',
    'image.jpg': 'IMAGE'
  };
  let textFilePathMock = Object.keys(fileMock)[0];
  let imageFilePathMock = Object.keys(fileMock)[1];

  describe('#getWithCharset', function() {
    beforeEach(function() {
      mockFS(fileMock);
    });

    afterEach(function() {
      mockFS.restore();
    });

    it('should call given callback with correct mimetype and charset', function() {
      let callbackStub = this.sandbox.stub();

      Mimetype.getWithCharset(textFilePathMock, null, callbackStub);
      let expectedCallbackMock = { ContentType: 'text/plain; charset=utf-8' };
      expect(callbackStub).to.be.calledWith(null, expectedCallbackMock);
    });

    it('should call given callback with correct mimetype if charset lookup fails', function() {
      let callbackStub = this.sandbox.stub();

      Mimetype.getWithCharset(imageFilePathMock, null, callbackStub);
      let expectedCallbackMock = { ContentType: 'image/jpeg' };
      expect(callbackStub).to.be.calledWith(null, expectedCallbackMock);
    });
  });
});
