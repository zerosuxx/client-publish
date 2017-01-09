var argv = require('yargs').argv;

var Config = {};

Config.s3 = {
  copyPattern: 'dist/**/*',
  options: {
    bucket: argv.s3Bucket || process.env.S3_BUCKET,
    region: argv.region || process.env.REGION,
    cwd: argv.cwd || process.env.CWD,
    profile: argv.profile || process.env.PROFILE,
    gzip: true
  },
  headers: {
    'Cache-Control': 'max-age=315360000, no-transform, public',
    'x-amz-acl': 'bucket-owner-full-control'
  }
};

Config.redirector = {
  url: argv.redirectorUrl || process.env.REDIRECTOR_URL,
  name: argv.redirectorName || process.env.REDIRECTOR_NAME,
  target: argv.redirectorTarget || process.env.REDIRECTOR_TARGET,
  apiSecret: argv.redirectorApiSecret || process.env.REDIRECTOR_API_SECRET
};

Config.revision = {
  /**
   * Generating a revision can be a type of 'timestamp', 'package' or can be set by --revision argument.
   */
  type: 'timestamp'
};

module.exports = Config;
