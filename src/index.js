"use strict";

const path = require("path");
const express = require("express");

const config = require(path.resolve(__dirname, "./config"));
const utils = require(path.resolve(__dirname, "./lib/utils"));
const middlewares = require(path.resolve(__dirname, "./lib/middlewares"));

/**
 * Service main function
 *
 * @return {Promise}        Fulfilled when service is started
 **/
function main() {
    try {
        const logInfo = utils.getLogger("info");
        const logCritical = utils.getLogger(
            "critical",
            "A critical error happened while starting the service:"
        );
        logInfo("Starting service...", {});
        const app = express();
        const serviceConfig = config.getService();
        return middlewares.start(app, serviceConfig, utils)
            .then(() => logInfo("Service started", {}))
            .catch(logCritical);
    } catch (error) {
        return Promise.reject(`Fatal error: ${error}`);
    }
}

exports.main = main;

/* istanbul ignore else */
if (process.env.NODE_ENV !== "test") {
    main();
}
