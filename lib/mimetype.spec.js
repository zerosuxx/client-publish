'use strict';

const Mimetype = require('./mimetype');

describe('Mimetype', () => {
  describe('#getWithCharset', () => {
    [
      {
        should: 'call given callback with correct mimetype',
        file: 'test.jpg',
        expectedContentType: 'image/jpeg'
      },
      {
        should: 'append charset=utf-8 if mime type starts with text',
        file: 'test.txt',
        expectedContentType: 'text/plain; charset=utf-8'
      },
      {
        should: 'append charset=utf-8 if file type is css',
        file: 'test.css',
        expectedContentType: 'text/css; charset=utf-8'
      },
      {
        should: 'append charset=utf-8 if mime type is application/javascript',
        file: 'test.js',
        expectedContentType: 'application/javascript; charset=utf-8'
      },
      {
        should: 'append charset=utf-8 if mime type is application/json',
        file: 'test.json',
        expectedContentType: 'application/json; charset=utf-8'
      }
    ].forEach((testCase) => {
      it(`should ${testCase.should}`, function() {
        const callbackStub = this.sandbox.stub();

        Mimetype.getWithCharset(testCase.file, null, callbackStub);

        expect(callbackStub).to.be.calledWith(null, {
          ContentType: testCase.expectedContentType
        });
      });
    });
  });
});
