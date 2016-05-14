'use strict';

function tbd(fnName) {
    return () => {
        throw new Error("Not implemented:" + fnName);
    };
}
exports.getService = tbd("getService");
//'use strict';

//const _ = require('lodash');
//const configDefault = require('./default');
//const configEnvironment = require('./environment');

//module.exports = _.merge({},
//configDefault,
//configEnvironment);
