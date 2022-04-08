'use strict';

const ConfigProvider = require('./config-provider');

describe('ConfigProvider', () => {
  const randomFeed = Math.floor(Math.random() * 100);

  let envStub;
  let configMap = {
    'string.default': { env: 'STRING', type: 'string', default: `test-${randomFeed}` },
    'boolean.default': { env: 'BOOLEAN', type: 'boolean', default: false },
    'number.default': { env: 'NUMBER', type: 'number', default: randomFeed },
    'string.no-default': { env: 'STRING_NO_DEFAULT', type: 'string' },
    'boolean.no-default': { env: 'BOOLEAN_NO_DEFAULT', type: 'boolean' },
    'invalid': { env: 'INVALID', type: 'invalid' },
    'string.multiple-envs': {
      env: ['STRING_MULTIPLE_ENVS_1', 'STRING_MULTIPLE_ENVS_2'],
      type: 'string'
    },
    'string.multiple-defaults': {
      env: 'STRING_MULTIPLE_DEFAULTS',
      type: 'string',
      defaults: { staging: `test-staging-${randomFeed}`, production: `test-production-${randomFeed}` }
    },
    'string.all-defaults': {
      env: 'STRING_MULTIPLE_DEFAULTS',
      type: 'string',
      default: `test-common-${randomFeed}`,
      defaults: { staging: `test-staging-${randomFeed}`, production: `test-production-${randomFeed}` }
    }
  };

  beforeEach(() => {
    envStub = sinon.stub(process, 'env');
  });

  afterEach(() => {
    envStub.restore();
  });

  const validTestCases = [
    {
      name: 'should return a basic value from an env var',
      environmentVariables: { STRING: `test-value-${randomFeed}` },
      configKey: 'string.default',
      expectedValue: `test-value-${randomFeed}`
    },
    {
      name: 'should return the default value if the env var is not set',
      environmentVariables: {},
      configKey: 'string.default',
      expectedValue: `test-${randomFeed}`
    },
    {
      name: 'should return a target env based value from a staging env var',
      targetEnv: 'staging',
      environmentVariables: { STRING_STAGING: `test-stage-${randomFeed}` },
      configKey: 'string.default',
      expectedValue: `test-stage-${randomFeed}`
    },
    {
      name: 'should return a target env based value from a production env var',
      targetEnv: 'production',
      environmentVariables: { STRING_PRODUCTION: `test-production-${randomFeed}` },
      configKey: 'string.default',
      expectedValue: `test-production-${randomFeed}`
    },
    {
      name: 'should return default value if targetEnv is invalid',
      targetEnv: 'invalid_env',
      environmentVariables: { STRING_INVALID_ENV: `test-env-${randomFeed}` },
      configKey: 'string.default',
      expectedValue: `test-${randomFeed}`
    },
    {
      name: 'should return default value if targetEnv is invalid but env specific values are set',
      targetEnv: 'invalid_env',
      environmentVariables: { STRING_STAGING: `test-staging-${randomFeed}` },
      configKey: 'string.default',
      expectedValue: `test-${randomFeed}`
    },
    {
      name: 'should return boolean value as boolean',
      environmentVariables: { BOOLEAN: 'true' },
      configKey: 'boolean.default',
      expectedValue: true
    },
    {
      name: 'should return false for a boolean value if it is not set',
      environmentVariables: {},
      configKey: 'boolean.no-default',
      expectedValue: false
    },
    {
      name: 'should return number value as number',
      environmentVariables: { NUMBER: '100' },
      configKey: 'number.default',
      expectedValue: 100
    },
    {
      name: 'should return float value as number',
      environmentVariables: { NUMBER: '100.5' },
      configKey: 'number.default',
      expectedValue: 100.5
    },
    {
      name: 'should return the first of listed env vars',
      environmentVariables: {
        STRING_MULTIPLE_ENVS_1: `test-1-${randomFeed}`,
        STRING_MULTIPLE_ENVS_2: `test-2-${randomFeed}`
      },
      configKey: 'string.multiple-envs',
      expectedValue: `test-1-${randomFeed}`
    },
    {
      name: 'should return the first available value based on the listed env vars',
      environmentVariables: {
        STRING_MULTIPLE_ENVS_2: `test-2-${randomFeed}`
      },
      configKey: 'string.multiple-envs',
      expectedValue: `test-2-${randomFeed}`
    },
    {
      name: 'should return the default for staging if available',
      targetEnv: 'staging',
      environmentVariables: {},
      configKey: 'string.multiple-defaults',
      expectedValue: `test-staging-${randomFeed}`
    },
    {
      name: 'should return the default for production if available',
      targetEnv: 'production',
      environmentVariables: {},
      configKey: 'string.multiple-defaults',
      expectedValue: `test-production-${randomFeed}`
    },
    {
      name: 'should return the shared default even there are env defaults',
      targetEnv: 'production',
      environmentVariables: {},
      configKey: 'string.all-defaults',
      expectedValue: `test-production-${randomFeed}`
    }
  ];

  validTestCases.forEach((testCase) => {
    it(testCase.name, () => {
      envStub.value(testCase.environmentVariables);

      const config = new ConfigProvider(configMap, testCase.targetEnv);

      expect(config.get(testCase.configKey)).to.equal(testCase.expectedValue);
    });
  });

  const invalidTestCases = [
    {
      name: 'should throw an error if a config key does not exist in the config',
      environmentVariables: {},
      configKey: 'invalid.key',
      expectedError: 'Missing configuration description for key "invalid.key"'
    },
    {
      name: 'should throw an error if the type in a config is invalid',
      environmentVariables: {},
      configKey: 'invalid',
      expectedError: 'Invalid "type" in configuration description for key "invalid"'
    },
    {
      name: 'should throw an error if a value is missing',
      environmentVariables: {},
      configKey: 'string.no-default',
      expectedError: 'Missing value for configuration key "string.no-default"'
    },
    {
      name: 'should throw an error if a numeric value is invalid',
      environmentVariables: { NUMBER: 'Not a Number' },
      configKey: 'number.default',
      expectedError: 'Invalid number value for configuration key "number.default"'
    }
  ];

  invalidTestCases.forEach((testCase) => {
    it(testCase.name, () => {
      envStub.value(testCase.environmentVariables);

      const config = new ConfigProvider(configMap, testCase.targetEnv);

      expect(() => config.get(testCase.configKey)).to.throw(testCase.expectedError);
    });
  });
});
