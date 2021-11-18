'use strict';

const defaultConfig = require('./default');

module.exports = {
  localDir: process.env.LOCAL_DIRECTORY || defaultConfig.localDir,
  projectName: process.env.PROJECT_NAME || false,
  projectHasCustomName: process.env.PROJECT_HAS_CUSTOM_NAME === 'true' || false,
  validationWaitTime: process.env.VALIDATION_WAIT_TIME || defaultConfig.validationWaitTime,
  deployTargets: process.env.FIREBASE_DEPLOY === 'true' ? ['redirector', 'firebase'] : ['redirector'],

  s3: {
    uploadParameters: {
      Bucket: process.env.S3_BUCKET || defaultConfig.s3.bucket,
      ACL: process.env.S3_ACL || defaultConfig.s3.acl,
      CacheControl: process.env.S3_CACHE_CONTROL || defaultConfig.s3.cacheControl
    },

    credentials: {
      region: process.env.AWS_REGION || defaultConfig.s3.awsRegion,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  },

  redirector: {
    url: process.env.REDIRECTOR_URL || defaultConfig.redirector.url,
    name: process.env.REDIRECTOR_NAME || process.env.PROJECT_NAME,
    target: process.env.REDIRECTOR_TARGET || defaultConfig.redirector.target,
    apiSecret: process.env.REDIRECTOR_API_SECRET
  },

  firebase: {
    project: process.env.FIREBASE_PROJECT,
    site: process.env.FIREBASE_SITE,
    accessToken: process.env.FIREBASE_TOKEN
  }
};
