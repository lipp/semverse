'use strict';

const _ = require('lodash/fp');
const app = require('express')();

const configService = _.get('service', require('./config'), {});
const start = require('./lib/middlewares');

// Main execution
// try {
start(_, app, configService, console.log);
//} catch (error) {
//  log('error', 'An unexpected error happened:', error.toString());
// Capture error stack ?
//}
