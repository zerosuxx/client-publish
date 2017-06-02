'use strict';

let sinon = require('sinon');
let chai = require('chai');
require('co-mocha');

before(function() {
  global.expect = chai.expect;
  global.sinon = sinon;

  chai.use(require('sinon-chai'));
});

beforeEach(function() {
  this.sandbox = sinon.sandbox.create();
  this.sinon = sinon;
});

afterEach(function() {
  this.sandbox.restore();
});
