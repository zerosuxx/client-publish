'use strict';

let config = require('../config');
let request = require('superagent');

class Redirector {

  static save(revision) {
    return request
      .post(config.redirector.url + '/api/route')
      .send({
        name: config.redirector.name,
        target: config.redirector.target + '/' + revision,
        revision: revision
      })
      .set('Accept', 'application/json')
      .set('x-auth', config.redirector.apiSecret)
      .then(result => result);
  }
}

module.exports = Redirector;
