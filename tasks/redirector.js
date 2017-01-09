'use strict';

module.exports = function(config) {
  return {
    save: function(revision) {
      let Revision = require('../lib/revision');

      if (!revision) {
        revision = Revision.get(config.revision.type);
      }

      let Q = require('q');

      let deferred = Q.defer();
      if (!config.redirector.url) {
        return deferred.resolve();
      }

      let request = require('superagent');

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
            throw new Error(err);
          }

          console.log('Successfully updated Emarsys Redirector Service!');
          deferred.resolve();
        });

      // TODO promise
      return deferred;
    }
  };
};
