'use strict';

const S3Wrapper = require('./redirector/s3-wrapper');
const Redirector = require('./redirector/redirector');
const RedirectorConfigValidator = require('./redirector/redirector-config-validator');
const RedirectorUploadValidator = require('./redirector/redirector-upload-validator');

const deployToRedirector = async (config, revision) => {
  const configValidationResult = RedirectorConfigValidator.validateConfig(config);

  if (!configValidationResult.isValid) {
    console.log(`> Invalid redirector config: ${configValidationResult.message}`);
    process.exit(1);
  }

  try {
    console.log(`> Uploading to S3 with revision ${revision}`);
    await S3Wrapper.publish(config, revision);
    console.log('> S3 upload successful');
  } catch (error) {
    console.log(`> Error while uploading to S3: ${error.message}`);
    console.log(error);
    process.exit(1);
  }

  const uploadValidationResult = await RedirectorUploadValidator.validateUpload(config, revision);

  if (!uploadValidationResult.isValid) {
    console.log(`> S3 upload invalid:
      ${uploadValidationResult.validatedFile}
      ${uploadValidationResult.message}
    `);
    process.exit(1);
  }

  try {
    console.log('> Updating redirector');
    await Redirector.save(config, revision);
    console.log('> Redirector update successful');
  } catch (error) {
    console.log(`> Error while updating redirector: ${error.message}`);
    console.log(error);
    process.exit(1);
  }
};

module.exports = {
  deployToRedirector
};
