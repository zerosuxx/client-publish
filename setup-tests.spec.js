'use strict';

let sinon = require('sinon');
let chai = require('chai');
require('sinon-as-promised');

before(function() {
  global.expect = chai.expect;
  global.sinon = sinon;

  chai.use(require('chai-subset'));
  chai.use(require('chai-as-promised'));
  chai.use(require('chai-datetime'));
  chai.use(require('sinon-chai'));
});

beforeEach(function() {
  this.sandbox = sinon.sandbox.create();
  this.sinon = sinon;
});

afterEach(function() {
  this.sandbox.restore();
});
