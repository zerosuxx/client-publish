'use strict';

let S3Wrapper = require('./lib/s3-wrapper');
let Redirector = require('./lib/redirector');
let Revision = require('./lib/revision');
let Merge = require('./lib/merge');
let ConfigValidator = require('./lib/config-validator');
let config = require('./config');
let argv = require('yargs').argv;
let inquirer = require('inquirer');

module.exports.deploy = function() {
  ConfigValidator.checkValues(config);

  let revision = Revision.get(Revision.REVISION_TYPE_TIMESTAMP, argv.revision);
  console.log(`> Uploading to S3 with revision ${revision}`);

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
      console.log(`> Error while deploying: ${err.message}`);
      console.log(err);
      process.exit(1);
    });
};

module.exports.merge = function() {
  let question = {
    type: 'confirm',
    name: 'merge',
    message: 'Do you really want to deploy to production?',
    default: false
  };

  inquirer.prompt([question]).then(function(answers) {
    if (answers.merge) {
      console.log('> Merging to production branch');
      Merge.toProduction()
        .then(function(result) {
          if (result.childProcess.exitCode > 0) {
            console.log('> Error while merging');
            console.log(result.stderr);
          } else {
            console.log('> Merge to production successful');
          }
          process.exit(result.childProcess.exitCode);
        })
        .catch(function(err) {
          console.log(`> Error while merging: ${err.message}`);
          console.log(err);
          process.exit(1);
        });
    }
  });
};
