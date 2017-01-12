'use strict';

let S3 = require('./lib/s3');
let Redirector = require('./lib/redirector');
let Revision = require('./lib/revision');

module.exports.deploy = function() {
  let revision = Revision.get(Revision.REVISION_TYPE_TIMESTAMP);
  console.log(`Deploying revision ${revision}`);

  S3.publish(revision)
    .then(() => {
      console.log('Deployment successful');
    })
    .catch((err) => {
      console.log('Error while deploying: ', err.message);
    });

  return Redirector.save(Revision.REVISION_TYPE_TIMESTAMP);
};

module.exports.lib = Revision;
