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
      .then(
        (result) => {
          console.log('Successfully updated Emarsys Redirector Service!');
          return result;
        },
        (error) => {
          console.log('There was an error while updating Emarsys Redirector Service!');
          throw error;
        }
      );
  }
}

module.exports = Redirector;
