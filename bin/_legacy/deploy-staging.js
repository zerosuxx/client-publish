#! /usr/bin/env node
'use strict';

process.env.DEPLOY_ENV = 'staging';
require('../../lib/_legacy').deploy();
