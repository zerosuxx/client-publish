'use strict';

const request = require('superagent');

class Redirector {
  static save(config, revision) {
    return request
      .post(config.get('redirector.url') + '/api/route')
      .send({
        name: config.get('redirector.name'),
        target: Redirector.getTarget(config, revision),
        revision: revision
      })
      .set('Accept', 'application/json')
      .set('x-auth', config.get('redirector.apiSecret'))
      .then(result => result);
  }

  static getTarget(config, revision) {
    if (config.get('projectName')) {
      return config.get('redirector.target') + '/' + config.get('projectName') + '/' + revision;
    } else {
      return config.get('redirector.target') + '/' + revision;
    }
  }
}

module.exports = Redirector;
