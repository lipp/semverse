'use strict';

const _ = require('lodash/fp');
const app = require('express')();

const config = _.get(require('./config'), 'service');
const start = require('./lib/middlewares');

// Main execution
try {
    start(_, app, config, console.log);
} catch (error) {
    log('error', 'An unexpected error happened:', error.toString());
    // Capture error stack ?
}
