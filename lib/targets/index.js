'use strict';

const S3Wrapper = require('./redirector/s3-wrapper');
const Redirector = require('./redirector/redirector');
const ConfigValidator = require('./redirector/config-validator');
const UploadValidator = require('./redirector/upload-validator');

const deployToRedirector = (config, revision) => {
  ConfigValidator.checkValues(config);

  console.log(`> Uploading to S3 with revision ${revision}`);

  return S3Wrapper.publish(config, revision)
    .then(() => {
      console.log('> S3 upload successful');
      return UploadValidator.validate(config, revision);
    })
    .then(() => {
      console.log('> Updating redirector');
      return Redirector.save(config, revision);
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

module.exports = {
  deployToRedirector
};
