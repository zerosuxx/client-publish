'use strict';

const deployEnv = process.env.DEPLOY_ENV || 'staging';
const stagingDefaults = {
  s3Bucket: 'ems-assets-staging',
  redirector: {
    url: 'https://redirector-staging.eservice.emarsys.com',
    target: 'assets.emarsys.com'
  }
};
const productionDefaults = {
  s3Bucket: 'ems-assets',
  redirector: {
    url: 'https://redirector.eservice.emarsys.net',
    target: 'assets.emarsys.net'
  }
};

module.exports = deployEnv === 'staging' ? stagingDefaults : productionDefaults;
