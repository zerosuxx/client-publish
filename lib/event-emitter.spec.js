'use strict';

let promisify = require('./event-emitter').promisify;
let EventEmitter = require('events');

describe('EventEmitter', function() {

  describe('#promisify', function() {
    let emitter;

    beforeEach(function() {
      emitter = new EventEmitter();
    });

    it('should return the result for event \'end\'', function() {
      let promise = promisify(emitter);
      emitter.emit('end', 'test');

      return promise.then((result) => {
        expect(result).to.eql('test');
      });
    });

    it('should return the error for event \'error\'', function() {
      let promise = promisify(emitter);
      emitter.emit('end', 'test');

      return promise.catch((result) => {
        expect(result).to.eql('test');
      });
    });


  });
});
