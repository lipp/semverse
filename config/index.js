'use strict';

const
    _ = require('lodash'),
    configDefault = require('./default'),
    configEnvironment = require('./environment');

module.exports = _.merge({},
        configDefault,
        configEnvironment);
