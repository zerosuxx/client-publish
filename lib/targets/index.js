'use strict';

const S3Wrapper = require('./redirector/s3-wrapper');
const Redirector = require('./redirector/redirector');
const RedirectorConfigValidator = require('./redirector/redirector-config-validator');
const RedirectorUploadValidator = require('./redirector/redirector-upload-validator');

const deployToRedirector = async (config, revision) => {
  const validationResult = RedirectorConfigValidator.validateConfig(config);

  if (!validationResult.isValid) {
    console.log(validationResult.message);
    process.exit(1);
  }

  try {
    console.log(`> Uploading to S3 with revision ${revision}`);
    await S3Wrapper.publish(config, revision);
    console.log('> S3 upload successful');
    await RedirectorUploadValidator.validateUpload(config, revision);
    console.log('> Updating redirector');
    await Redirector.save(config, revision);
    console.log('> Redirector update successful');
  } catch (error) {
    console.log(`> Error while deploying: ${error.message}`);
    console.log(error);
    process.exit(1);
  }
};

module.exports = {
  deployToRedirector
};
