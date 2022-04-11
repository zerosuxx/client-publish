'use strict';

class ConfigProvider {
  constructor(configMap, targetEnv) {
    this.configMap = configMap;
    this.targetEnv = targetEnv;
  }

  get(configMapKey) {
    const config = this.configMap[configMapKey];

    if (!config) {
      throw new Error(`Missing configuration description for key "${configMapKey}"`);
    }

    if (!this._isConfigTypeValid(config.type)) {
      throw new Error(`Invalid "type" in configuration description for key "${configMapKey}"`);
    }

    const valueForEnv = Array.isArray(config.env) ?
      this._getFirstValueForEnvList(config.env) :
      this._getValueForEnv(config.env);

    const value = valueForEnv || this._getDefaultValueForTargetEnv(config.defaults, config.default);

    if (config.type === 'boolean') {
      return this._convertToBoolean(value);
    }

    if (value === undefined) {
      if (!config.optional) {
        throw new TypeError(`Missing value for configuration key "${configMapKey}"`);
      }

      return value;
    }

    const valueAsNumber = this._convertToNumber(value);

    if (Number.isNaN(valueAsNumber)) {
      throw new TypeError(`Invalid number value for configuration key "${configMapKey}"`);
    }

    return valueAsNumber;
  }

  _isTargetEnvValid() {
    const allowedTargetEnvs = ['production', 'staging'];

    return allowedTargetEnvs.includes(this.targetEnv);
  }

  _isConfigTypeValid(type) {
    const allowedConfigTypes = ['string', 'number', 'boolean'];

    return allowedConfigTypes.includes(type);
  }

  _getDefaultValueForTargetEnv(defaults, defaultValue) {
    if (this._isTargetEnvValid() && typeof defaults === 'object' && this.targetEnv in defaults) {
      return defaults[this.targetEnv];
    }

    return defaultValue;
  }

  _getValueForEnv(env) {
    if (!this._isTargetEnvValid()) {
      return process.env[env];
    }

    return process.env[env] || process.env[`${env}_${this._environmentSuffix}`];
  }

  _getFirstValueForEnvList(envKeyList) {
    for (const envKey of envKeyList) {
      const valueForEnvKey = this._getValueForEnv(envKey);

      if (valueForEnvKey !== undefined) {
        return valueForEnvKey;
      }
    }
  }

  get _environmentSuffix() {
    return this.targetEnv.toUpperCase();
  }

  _convertToBoolean(value) {
    return value !== undefined && value !== false && value !== 'false';
  }

  _convertToNumber(value) {
    return parseFloat(value, 10);
  }
};

module.exports = ConfigProvider;
