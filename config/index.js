'use strict';

module.exports = {
  localDir: process.env.LOCAL_DIRECTORY || 'dist',

  s3: {
    uploadParameters: {
      Bucket: process.env.S3_BUCKET || '',
      ACL: process.env.S3_ACL || 'public-read',
      CacheControl: 'max-age=315360000, no-transform, public'
    },

    credentials: {
      region: process.env.AWS_DEFAULT_REGION || '',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
  },

  redirector: {
    url: process.env.REDIRECTOR_URL || 'https://example.com',
    name: process.env.REDIRECTOR_NAME || 'redirector_name',
    target: process.env.REDIRECTOR_TARGET || 'redirector_target',
    apiSecret: process.env.REDIRECTOR_API_SECRET || 'api_secret'
  }
};
