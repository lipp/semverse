/**
 * ### Default configuration
 *
 * This configuration is the most basic but complete one
 * All properties can be overloaded with more specific configurations
 *
 * @module Configuration/Default
 */
"use strict";
module.exports = {
    service: {
        port: 9100,
        middlewareList: [
            "swaggerUI",
            "404",
            "error"
        ]
    }
};
