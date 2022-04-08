'use strict';

class ConfigProvider {
  constructor(configMap, targetEnv) {
    this.configMap = configMap;
    this.targetEnv = targetEnv;
  }

  get(key) {
    const { env: envKey, default: defaultValue, isBoolean } = this.configMap[key];

    let result;

    if (this._isEnvironmentValid) {
      const envSuffix = this.targetEnv.toUpperCase();

      result = process.env[envKey] || process.env[`${envKey}_${envSuffix}`] || defaultValue;
    } else {
      result = process.env[envKey] || defaultValue;
    }

    return isBoolean ? this._convertToBoolean(result) : result;
  }

  get _isEnvironmentValid() {
    const allowedEnvironments = ['production', 'staging'];

    return allowedEnvironments.includes(this.targetEnv);
  }

  _convertToBoolean(value) {
    return value !== undefined && value !== false && value !== 'false';
  }
};

module.exports = ConfigProvider;
