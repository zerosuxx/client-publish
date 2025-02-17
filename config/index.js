'use strict';

const basicConfig = {
  'localDir': {
    env: 'LOCAL_DIRECTORY',
    type: 'string',
    default: 'dist'
  },
  'projectName': {
    env: 'PROJECT_NAME',
    type: 'string',
    optional: true
  },
  'projectHasCustomName': {
    env: 'PROJECT_HAS_CUSTOM_NAME',
    type: 'boolean',
    default: false
  },
  'validationWaitTime': {
    env: 'VALIDATION_WAIT_TIME',
    type: 'number',
    default: 1000
  }
};

const s3Config = {
  's3.uploadParameters.Bucket': {
    env: 'S3_BUCKET',
    type: 'string',
    defaults: {
      staging: 'ems-assets-staging',
      production: 'ems-assets'
    }
  },
  's3.uploadParameters.ACL': {
    env: 'S3_ACL',
    type: 'string',
    default: 'public-read'
  },
  's3.uploadParameters.CacheControl': {
    env: 'S3_CACHE_CONTROL',
    type: 'string',
    default: 'max-age=315360000, no-transform, public'
  },
  's3.credentials.region': {
    env: 'AWS_REGION',
    type: 'string',
    default: 'eu-west-1'
  },
  's3.credentials.accessKeyId': {
    env: 'AWS_ACCESS_KEY_ID',
    type: 'string',
    optional: true
  },
  's3.credentials.secretAccessKey': {
    env: 'AWS_SECRET_ACCESS_KEY',
    type: 'string',
    optional: true
  }
};

const redirectorConfig = {
  'redirector.deploy': {
    env: 'REDIRECTOR_DEPLOY',
    type: 'boolean',
    default: true
  },
  'redirector.url': {
    env: 'REDIRECTOR_URL',
    type: 'string',
    defaults: {
      staging: 'https://redirector-staging.gservice.emarsys.com',
      production: 'https://redirector.gservice.emarsys.net'
    }
  },
  'redirector.target': {
    env: 'REDIRECTOR_TARGET',
    type: 'string',
    defaults: {
      staging: 'assets.emarsys.com',
      production: 'assets.emarsys.net'
    }
  },
  'redirector.name': {
    env: ['REDIRECTOR_NAME', 'PROJECT_NAME'],
    type: 'string',
    optional: true
  },
  'redirector.apiSecret': {
    env: 'REDIRECTOR_API_SECRET',
    type: 'string',
    optional: true
  }
};

const firebaseConfig = {
  'firebase.deploy': {
    env: 'FIREBASE_DEPLOY',
    type: 'boolean',
    default: false
  },
  'firebase.project': {
    env: 'FIREBASE_PROJECT',
    type: 'string',
    optional: true
  },
  'firebase.site': {
    env: 'FIREBASE_SITE',
    type: 'string',
    optional: true
  },
  'firebase.configFile': {
    env: 'FIREBASE_CONFIG_FILE',
    type: 'string',
    default: './firebase.json'
  },
  'firebase.credentials': {
    env: 'GOOGLE_APPLICATION_CREDENTIALS_JSON',
    type: 'string',
    optional: true
  }
};

module.exports = {
  ...basicConfig,
  ...s3Config,
  ...redirectorConfig,
  ...firebaseConfig
};
