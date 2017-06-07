# client-publish
[![Dependency Status](https://david-dm.org/emartech/client-publish.svg)](https://david-dm.org/emartech/client-publish)
[![devDependency Status](https://david-dm.org/emartech/client-publish/dev-status.svg)](https://david-dm.org/emartech/client-publish?type=dev)

Uploads the bundled client application to Amazon S3 and sets up redirection to that bucket.

### Install

```bash
npm install @emartech/client-publish --save-dev
```

### Configuration

- LOCAL_DIRECTORY: place of the bundled application, defaults to 'dist'
- PROJECT_NAME: name of the project, will be the subdirectory in the S3 bucket, required
- PROJECT_HAS_CUSTOM_NAME: directory names not containing PROJECT_NAME are not allowed by default, you can enable them with it
- S3_BUCKET: the S3 bucket where the application will be uploaded to, required
- S3_ACL: S3 buckets ACL setting, defaults to 'public-read'
- S3_CACHE_CONTROL: S3 buckets cache control, defaults to 'max-age=315360000, no-transform, public'
- AWS_REGION: AWS region, defaults to 'eu-west-1'
- AWS_ACCESS_KEY_ID: AWS access key, required
- AWS_SECRET_ACCESS_KEY: AWS secret for access key, required
- REDIRECTOR_URL: URL of the redirector service, required
- REDIRECTOR_TARGET: the domain where the redirector should point, required
- REDIRECTOR_API_SECRET: secret of the redirector service, required
- DEPLOY_ENV: deployment environment, provides default values for S3_BUCKET, REDIRECTOR_URL, REDIRECTOR_TARGET, can be 'staging' or 'production', defaults to 'staging'

### Usage

Deploy scripts work from current branch.
Master branch stands for staging, production branch stands for production.
Merge only to production when you want deployment there.
Merge can be run from local machine, deploys from CI server.

```json
{
  "scripts": {
    "deploy-staging": "client-deploy-staging",
    "deploy-production": "client-deploy-production",
    "merge-production": "client-merge"
  }
}
```

- client-deploy: deploy application
- client-deploy-staging: sets defaults for staging and deploy application
- client-deploy-production: sets defaults for production and deploy application
- client-merge: merge and push to production from master

### Usage with Codeship

Set the following environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REDIRECTOR_API_SECRET_STAGING, 
REDIRECTOR_API_SECRET_PRODUCTION, PROJECT_NAME.

Create npm scripts:

```json
{
  "deploy-staging": "REDIRECTOR_API_SECRET=$REDIRECTOR_API_SECRET_STAGING client-deploy-staging",
  "deploy-production": "REDIRECTOR_API_SECRET=$REDIRECTOR_API_SECRET_PRODUCTION client-deploy-production",
  "merge-production": "client-merge"
}
```

Then setup deployment for master and production branch.

```bash
# master branch
npm run build
npm run deploy-staging

# production branch
npm run build
npm run deploy-production
```
