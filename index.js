'use strict';

let S3Wrapper = require('./lib/s3-wrapper');
let Redirector = require('./lib/redirector');
let Revision = require('./lib/revision');
let Merge = require('./lib/merge');
let argv = require('yargs').argv;
let inquirer = require('inquirer');

module.exports.publish = function() {
  let revision = Revision.get(Revision.REVISION_TYPE_TIMESTAMP, argv.revision);
  console.log(`> Publishing with revision ${revision}`);

  S3Wrapper.publish(revision)
    .then(() => {
      console.log('> S3 upload successful');
      console.log('> Updating redirector');
      return Redirector.save(revision);
    })
    .then(() => {
      console.log('> Redirector update successful');
    })
    .catch((err) => {
      console.log('> Error while publishing');
      console.log(err);
    });
};

module.exports.deploy = function() {
  let question = {
    type: 'confirm',
    name: 'deploy',
    message: 'Do you really want to deploy to production?',
    default: false
  };

  inquirer.prompt([question]).then(function(answers) {
    if (answers.deploy) {
      console.log('> Merging to production branch');
      Merge.toProduction()
        .then(function(result) {
          console.log(result);
          process.exit(result.exit);
        })
        .catch(function(err) {
          console.log(err);
          process.exit(1);
        });
    }
  });
};
