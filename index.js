'use strict';

let S3Wrapper = require('./lib/s3-wrapper');
let Redirector = require('./lib/redirector');
let Revision = require('./lib/revision');
let argv = require('yargs').argv;

module.exports.deploy = function() {
  let revision = Revision.get(Revision.REVISION_TYPE_TIMESTAMP, argv.revision);
  console.log(`> Deploying with revision ${revision}`);

  S3Wrapper.publish(revision)
    .then(() => {
      console.log('> S3 deployment successful');
      console.log('> Updating redirector');
      return Redirector.save(revision);
    })
    .then(() => {
      console.log('> Redirector update successful');
    })
    .catch((err) => {
      console.log('> Error while deploying');
      console.log(err);
    });
};
