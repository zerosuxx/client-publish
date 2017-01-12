'use strict';

let s3 = require('./lib/s3');
let Redirector = require('./lib/redirector');
let Revision = require('./lib/revision');
const REVISION_TYPE = 'timestamp';

module.exports.deploy = function() {
  let revision = Revision.get(REVISION_TYPE);

  s3.publish(revision)
    .then(() => {
      console.log('Deploy successful');
    })
    .catch((err) => {
      console.log('Error: ', err.message);
    });

  return Redirector.save(REVISION_TYPE);
};

module.exports.lib = {
  revision: require('./lib/revision')
};
