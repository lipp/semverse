/**
 * ### Environment configuration loader
 *
 * Overload configuration with environment variables
 *
 * @module Configuration/Environment
 */
"use strict";

const {
    get
} = require("lodash/fp");

exports.get = (variable) => get(variable, process.env);

// This section is only for service execution
/* istanbul ignore if */
if (process.env.NODE_ENV === "production") {
    exports.service = {
        port: exports.get('PORT')
    };
}
