#! /usr/bin/env node
'use strict';

process.env.DEPLOY_ENV = 'production';
require('../../lib/_legacy').deploy();
