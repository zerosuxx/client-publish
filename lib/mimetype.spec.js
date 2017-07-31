'use strict';

const mockFS = require('mock-fs');
const mime = require('mime');
const Mimetype = require('./mimetype');

describe('Mimetype', function() {
  let fileMock = { 'test.txt': 'content' };
  let filePathMock = Object.keys(fileMock)[0];

  describe('#getWithCharset', function() {
    beforeEach(function() {
      mockFS(fileMock);
    });

    afterEach(function() {
      mockFS.restore();
    });

    it('should call given callback with correct mimetype and charset', function() {
      let callbackStub = this.sandbox.stub();

      Mimetype.getWithCharset(filePathMock, null, callbackStub);
      let expectedCallbackMock = { ContentType: 'text/plain; charset=utf-8' };
      expect(callbackStub).to.be.calledWith(null, expectedCallbackMock);
    });

    it('should call given callback with correct mimetype if charset lookup fails', function() {
      this.sandbox.stub(mime.charsets, 'lookup').returns(false);

      let callbackStub = this.sandbox.stub();

      Mimetype.getWithCharset(filePathMock, null, callbackStub);
      let expectedCallbackMock = { ContentType: 'text/plain' };
      expect(callbackStub).to.be.calledWith(null, expectedCallbackMock);
    });
  });
});
