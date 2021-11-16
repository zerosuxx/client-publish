'use strict';

const deployEnv = process.env.DEPLOY_ENV || 'staging';

const commonDefaults = {
  localDir: 'dist',
  validationWaitTime: 1000,
  s3: {
    acl: 'public-read',
    cacheControl: 'max-age=315360000, no-transform, public',
    awsRegion: 'eu-west-1'
  }
};

const stagingDefaults = {
  s3: {
    bucket: 'ems-assets-staging'
  },
  redirector: {
    url: 'https://redirector-staging.gservice.emarsys.com',
    target: 'assets.emarsys.com'
  }
};

const productionDefaults = {
  s3: {
    bucket: 'ems-assets'
  },
  redirector: {
    url: 'https://redirector.gservice.emarsys.net',
    target: 'assets.emarsys.net'
  }
};

module.exports = deployEnv === 'staging' ?
  Object.assign(commonDefaults, stagingDefaults) :
  Object.assign(commonDefaults, productionDefaults);
