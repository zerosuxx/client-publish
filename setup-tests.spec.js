'use strict';

let sinon = require('sinon');
let chai = require('chai');

before(function() {
  global.expect = chai.expect;
  global.sinon = sinon;

  chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));
});

beforeEach(function() {
  this.sandbox = sinon.createSandbox();
  this.sinon = sinon;
});

afterEach(function() {
  this.sandbox.restore();
});
