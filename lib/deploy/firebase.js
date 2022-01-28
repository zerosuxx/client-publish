'use strict';

const Firebase = require('./firebase/firebase');
const FirebaseConfigValidator = require('./firebase/firebase-config-validator');

const deployToFirebase = async (config, revision) => {
  const configValidationResult = FirebaseConfigValidator.validateConfig(config);

  if (!configValidationResult.isValid) {
    console.error(`> Invalid Firebase config: ${configValidationResult.message}`);
    process.exit(1);
  }

  try {
    console.log(`> Uploading to Firebase with revision ${revision}`);
    await Firebase.save(config, revision);
    console.log('> Firebase upload successful');
  } catch (error) {
    console.error(`> Error while updating Firebase: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

module.exports = deployToFirebase;
