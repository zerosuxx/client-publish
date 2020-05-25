'use strict';

const deployEnv = process.env.DEPLOY_ENV || 'staging';
const stagingDefaults = {
  s3Bucket: 'ems-assets-staging',
  redirector: {
    url: 'https://redirector-staging.gservice.emarsys.com',
    target: 'assets.emarsys.com'
  }
};
const productionDefaults = {
  s3Bucket: 'ems-assets',
  redirector: {
    url: 'https://redirector.gservice.emarsys.net',
    target: 'assets.emarsys.net'
  }
};

module.exports = deployEnv === 'staging' ? stagingDefaults : productionDefaults;
