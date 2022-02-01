# client-publish
[![NPM version](https://img.shields.io/npm/v/@emartech/client-publish)](https://www.npmjs.com/package/@emartech/client-publish)
![Dependency Status](https://img.shields.io/librariesio/release/npm/@emartech/client-publish)
[![Build status](https://codeship.com/projects/85bcf880-ba15-0134-1797-62f01c293f61/status?branch=master)](https://app.codeship.com/projects/85bcf880-ba15-0134-1797-62f01c293f61)

Deployer for client side projects. Uploads the bundled client application to target distribution platform (Amazon S3 and/or Firebase) and sets up redirection to that bucket for S3 deploys.

### Install

```bash
npm install @emartech/client-publish --save-dev
```

### Usage

This package exposes a command called `client-publish`. It can be used for several things:

- Get the current or next revision of the project (`revision`)
- Deploy project to a target platform (`deploy`)
- Create a new git tag for the project (`tag`)
- Merge master branch into production for production deploys (`merge`)

For detailed usage see help:
```bash
client-publish help
```

### Deployment Configuration

To deploy the project, some options must be configured via environment variables. These environment variables must be set on the CI/CD pipeline.

#### Generic configuration

| env var           | description                                          | required | default value |
| ----------------- | ---------------------------------------------------- | -------- | ------------- |
| `DEPLOY_ENV`      | deployment env, can be `"staging"` or `"production"` |          | `"staging"`   |
| `LOCAL_DIRECTORY` | place of the bundled application                     |          | `"dist"`      |

#### Firebase configuration

| env var                               | description                                                              | required | default value |
| ------------------------------------- | ------------------------------------------------------------------------ | -------- | ------------- |
| `FIREBASE_DEPLOY`                     | if true, it will deploy to the Firebase platform or not                  |          | `false`       |
| `FIREBASE_PROJECT`                    | the name of the GCP project for Firebase Hosting                         | `true`   |               |
| `FIREBASE_SITE`                       | the Firebase Hosting site used to host the asset                         | `true`   |               |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | the base64 encoded Google service account credential for Firebase deploy | `true`   |               |

#### Redirector configuration

| env var                 | description                                                            | required | default value                               |
| ----------------------- | ---------------------------------------------------------------------- | -------- | ------------------------------------------- |
| `PROJECT_NAME`          | name of the project, will be used as the subdirectory in the S3 bucket | `true`   |                                             |
| `S3_ACL`                | S3 buckets ACL setting                                                 |          | `"public-read"`                             |
| `S3_CACHE_CONTROL`      | S3 buckets cache control                                               |          | `"max-age=315360000, no-transform, public"` |
| `AWS_REGION`            | AWS region                                                             |          | `"eu-west-1"`                               |
| `AWS_ACCESS_KEY_ID`     | AWS access key                                                         | `true`   |                                             |
| `AWS_SECRET_ACCESS_KEY` | AWS secret for access key                                              | `true`   |                                             |
| `REDIRECTOR_API_SECRET` | secret of the redirector service                                       | `true`   |                                             |

Some furter options for the redirector deploy can be overridden but are not required if the `DEPLOY_ENV` env variable is set.

| env var             | description                                             | default value for staging                           | default value for production                |
| ------------------- | ------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| `S3_BUCKET`         | the S3 bucket where the application will be uploaded to | `'ems-assets-staging'`                              | `'ems-assets'`                              |
| `REDIRECTOR_URL`    | URL of the redirector service                           | `'https://redirector-staging.gservice.emarsys.com'` | `'https://redirector.gservice.emarsys.net'` |
| `REDIRECTOR_TARGET` | the domain where the redirector should point            | `'assets.emarsys.com'`                              | `'assets.emarsys.net'`                      |

### Usage with Codeship

Set the following environment variables:
- `PROJECT_NAME`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `REDIRECTOR_API_SECRET_STAGING`
- `REDIRECTOR_API_SECRET_PRODUCTION`
- `FIREBASE_PROJECT_STAGING` (optional)
- `FIREBASE_PROJECT_STAGING` (optional)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (optional)
- `FIREBASE_SITE_STAGING` (optional)
- `FIREBASE_SITE_PRODUCTION` (optional)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON_PRODUCTION` (optional)

Set up the following NPM scripts in your `package.json`. You can pass additional arguments to the client-publish command here.

```json
{
  "scripts": {
    "deploy-staging": "client-publish deploy --target-env staging",
    "deploy-production": "client-publish deploy --target-env production"
  }
}
```

Set up deployment for master and production branch.

```bash
# master branch
export REDIRECTOR_API_SECRET=REDIRECTOR_API_SECRET_STAGING
export FIREBASE_DEPLOY=true # enables deploying to Firebase
export FIREBASE_PROJECT=FIREBASE_PROJECT_STAGING
export FIREBASE_SITE=FIREBASE_SITE_STAGING
export GOOGLE_APPLICATION_CREDENTIALS_JSON=GOOGLE_APPLICATION_CREDENTIALS_JSON_STAGING
npm run build
npm run deploy-staging

# production branch
export REDIRECTOR_API_SECRET=REDIRECTOR_API_SECRET_STAGING
export FIREBASE_DEPLOY=true # enables deploying to Firebase
export FIREBASE_PROJECT=FIREBASE_PROJECT_STAGING
export FIREBASE_SITE=FIREBASE_SITE_STAGING
export GOOGLE_APPLICATION_CREDENTIALS_JSON=GOOGLE_APPLICATION_CREDENTIALS_JSON_STAGING
npm run build
npm run deploy-production
```

### Legacy Usage ![Deprecated](https://img.shields.io/badge/-deprecated-red)

For compatibility with older versions this package also exposes four other commands:

- `client-deploy`: deploy application
- `client-deploy-staging`: sets defaults for staging and deploy application
- `client-deploy-production`: sets defaults for production and deploy application
- `client-merge`: merge and push to production from master

To use these commands the environment variables in the [Deployment Configuration](#deployment-configuration) section must be present. You can also use these commands npm scripts.

```json
{
  "scripts": {
    "deploy-staging": "client-deploy-staging",
    "deploy-production": "client-deploy-production",
    "merge-production": "client-merge"
  }
}
```

