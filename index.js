'use strict';

let S3Wrapper = require('./lib/s3-wrapper');
let Redirector = require('./lib/redirector');
let Revision = require('./lib/revision');
let argv = require('yargs').argv;

module.exports.deploy = function() {
  let revision = Revision.get(Revision.REVISION_TYPE_TIMESTAMP, argv.revision);
  console.log(`Deploying revision ${revision}`);

  S3Wrapper.publish(revision)
    .then(() => {
      console.log('Deployment successful');
    })
    .catch((err) => {
      console.log('Error while deploying: ', err.message);
    });

  return Redirector.save(Revision.REVISION_TYPE_TIMESTAMP);
};

module.exports.lib = Revision;
