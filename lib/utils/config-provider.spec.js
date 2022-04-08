'use strict';

const ConfigProvider = require('./config-provider');

describe('ConfigProvider', () => {
  const randomFeed = Math.floor(Math.random() * 100);

  let envStub;
  let configMap = {
    'localDir': { env: 'LOCAL_DIRECTORY', default: `dist-${randomFeed}` },
    'projectHasCustomName': { env: 'PROJECT_HAS_CUSTOM_NAME', default: false, isBoolean: true },
    'firebase.project': { env: 'FIREBASE_PROJECT' },
    'firebase.site': { env: 'FIREBASE_SITE' },
    'firebase.credentials.content': { env: 'GOOGLE_APPLICATION_CREDENTIALS_JSON' },
    'boolean.without-default': { env: 'BOOLEAN_WITHOUT_DEFAULT', isBoolean: true }
  };

  beforeEach(() => {
    envStub = sinon.stub(process, 'env');
  });

  afterEach(() => {
    envStub.restore();
  });

  const testCases = [
    {
      name: 'should return a basic value from an env var from root level',
      environmentVariables: { LOCAL_DIRECTORY: `test-dir-${randomFeed}` },
      configKey: 'localDir',
      expectedValue: `test-dir-${randomFeed}`
    },
    {
      name: 'should return a basic value from an env var from sublevel',
      environmentVariables: { FIREBASE_PROJECT: `test-firebase-project-${randomFeed}` },
      configKey: 'firebase.project',
      expectedValue: `test-firebase-project-${randomFeed}`
    },
    {
      name: 'should return a basic value from an env var from third level',
      environmentVariables: { GOOGLE_APPLICATION_CREDENTIALS_JSON: `{ "name": ${randomFeed} }` },
      configKey: 'firebase.credentials.content',
      expectedValue: `{ "name": ${randomFeed} }`
    },
    {
      name: 'should return the default value if the env var is not set',
      environmentVariables: {},
      configKey: 'localDir',
      expectedValue: `dist-${randomFeed}`
    },
    {
      name: 'should return a target env based value from a staging env var',
      targetEnv: 'staging',
      environmentVariables: { FIREBASE_PROJECT_STAGING: `test-firebase-project-stage-${randomFeed}` },
      configKey: 'firebase.project',
      expectedValue: `test-firebase-project-stage-${randomFeed}`
    },
    {
      name: 'should return a target env based value from a production env var',
      targetEnv: 'production',
      environmentVariables: { FIREBASE_PROJECT_PRODUCTION: `test-firebase-project-production-${randomFeed}` },
      configKey: 'firebase.project',
      expectedValue: `test-firebase-project-production-${randomFeed}`
    },
    {
      name: 'should return default value if targetEnv is invalid',
      targetEnv: 'invalid_env',
      environmentVariables: { LOCAL_DIRECTORY_INVALID_ENV: `dist-env-${randomFeed}` },
      configKey: 'localDir',
      expectedValue: `dist-${randomFeed}`
    },
    {
      name: 'should return default value if targetEnv is invalid but env specific values are set',
      targetEnv: 'invalid_env',
      environmentVariables: { LOCAL_DIRECTORY_STAGING: `dist-staging-${randomFeed}` },
      configKey: 'localDir',
      expectedValue: `dist-${randomFeed}`
    },
    {
      name: 'should return boolean value as boolean',
      environmentVariables: { PROJECT_HAS_CUSTOM_NAME: 'true' },
      configKey: 'projectHasCustomName',
      expectedValue: true
    },
    {
      name: 'should return false for a boolean value if it is not set',
      environmentVariables: {},
      configKey: 'boolean.without-default',
      expectedValue: false
    }
  ];

  testCases.forEach((testCase) => {
    it(testCase.name, () => {
      envStub.value(testCase.environmentVariables);

      const config = new ConfigProvider(configMap, testCase.targetEnv);

      expect(config.get(testCase.configKey)).to.equal(testCase.expectedValue);
    });
  });
});
