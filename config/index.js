'use strict';

const defaultConfig = require('./default');

module.exports = {
  localDir: process.env.LOCAL_DIRECTORY || 'dist',
  projectName: process.env.PROJECT_NAME || false,
  projectHasCustomName: process.env.PROJECT_HAS_CUSTOM_NAME === 'true' || false,

  s3: {
    uploadParameters: {
      Bucket: process.env.S3_BUCKET || defaultConfig.s3Bucket,
      ACL: process.env.S3_ACL || 'public-read',
      CacheControl: process.env.S3_CACHE_CONTROL || 'max-age=315360000, no-transform, public'
    },

    credentials: {
      region: process.env.AWS_DEFAULT_REGION || 'eu-west-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  },

  redirector: {
    url: process.env.REDIRECTOR_URL || defaultConfig.redirector.url,
    name: process.env.REDIRECTOR_NAME || process.env.PROJECT_NAME,
    target: process.env.REDIRECTOR_TARGET || defaultConfig.redirector.target,
    apiSecret: process.env.REDIRECTOR_API_SECRET
  }
};
