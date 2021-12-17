'use strict';

const Firebase = require('./firebase/firebase');
const FirebaseConfigValidator = require('./firebase/firebase-config-validator');

const deployToFirebase = async (config, revision) => {
  const configValidationResult = FirebaseConfigValidator.validateConfig(config);

  if (!configValidationResult.isValid) {
    console.log(`> Invalid Firebase config: ${configValidationResult.message}`);
    process.exit(1);
  }

  try {
    console.log(`> Uploading to Firebase with revision ${revision}`);
    await Firebase.save(config, revision);
    console.log('> Firebase upload successful');
  } catch (error) {
    console.log(`> Error while updating Firebase: ${error.message}`);
    console.log(error);
    process.exit(1);
  }
};

module.exports = deployToFirebase;
