'use strict';

let config = require('../config');
let request = require('superagent');

module.exports = {
  save: function(revision) {

    return new Promise(function(resolve, reject) {
      request
        .post(config.redirector.url + '/api/route')
        .send({
          name: config.redirector.name,
          target: config.redirector.target + '/' + revision,
          revision: revision
        })
        .set('Accept', 'application/json')
        .set('x-auth', config.redirector.apiSecret)
        .end(function(err) {
          if (err) {
            console.log('There was an error while updating Emarsys Redirector Service!');
            console.log(err);
            reject(err);
          }

          console.log('Successfully updated Emarsys Redirector Service!');
          resolve();
        });
    });
  }
};
