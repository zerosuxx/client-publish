'use strict';

const Merge = require('./merge/merge');

const mergeMasterToProduction = () => {
  console.log('> Merging to production branch');

  Merge.toProduction()
    .then(function(result) {
      if (result.childProcess.exitCode > 0) {
        console.log('> Error while merging');
        console.log(result.stderr);
      } else {
        console.log('> Merge to production successful');
      }

      process.exit(result.childProcess.exitCode);
    })
    .catch(function(err) {
      console.log(`> Error while merging: ${err.message}`);
      console.log(err);

      process.exit(1);
    });
};

module.exports = {
  mergeMasterToProduction
};

