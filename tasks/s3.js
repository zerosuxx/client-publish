'use strict';

module.exports = function(config) {
  return {
    publish: function(revision) {
      let glob = require('glob');
      let rename = require('rename');
      let Revision = require('/lib/revision');
      let s3deploy = require('s3-deploy').deploy;

      if (!revision) {
        revision = Revision.get(config.revision.type);
      }

      let globbedFiles = glob.sync(config.s3.copyPattern).map(function(fileObj) {
        return rename(fileObj, {
          dirname: '/' + revision + '/' + fileObj.dirname
        });
      });

      let AWSOptions = {
        region: config.s3.options.region
      };

      let s3Options = {
        Bucket: config.s3.options.bucket,
        ContentEncoding: config.s3.options.gzip,
        CacheControl: config.s3.cache ? 'max-age=' + config.s3.cache : undefined
      };


      return s3deploy.deploy(
          globbedFiles,
          config.s3.options,
          AWSOptions,
          s3Options,
          {}
      );
    }
  };
};
