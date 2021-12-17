'use strict';

const request = require('superagent');

class Redirector {
  static save(config, revision) {
    return request
      .post(config.redirector.url + '/api/route')
      .send({
        name: config.redirector.name,
        target: Redirector.getTarget(config, revision),
        revision: revision
      })
      .set('Accept', 'application/json')
      .set('x-auth', config.redirector.apiSecret)
      .then(result => result);
  }

  static getTarget(config, revision) {
    if (config.projectName) {
      return config.redirector.target + '/' + config.projectName + '/' + revision;
    } else {
      return config.redirector.target + '/' + revision;
    }
  }
}

module.exports = Redirector;
