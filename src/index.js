/**
 * ### Entry point module
 *
 * This is where everything begins: We instanciate a new service and start it for
 * everyone to see :3
 *
 * @module Main
 */
"use strict";

const path = require("path");
const express = require("express");
const BPromise = require("bluebird");

const utils = require(path.resolve(__dirname, "lib/utils"));

const log = utils.log;
const logAndResolve = utils.logAndResolve;
const logAndReject = utils.logAndReject;

const config = require(path.resolve(__dirname, "config"));
const middlewares = require(path.resolve(__dirname, "lib/middlewares"));

/**
 * Add middlewares to the context
 * @param {Object} config - Current config
 * @param {Object} service - Service reference
 * @return {Promise<Object>} Mutated with middlewares
 **/
exports.addMiddlewares = function(config, service) {
    log("info", "Adding middlewares...");
    return middlewares
        .loadMiddlewares(config, service)
        .then(logAndResolve("info", "Middlewares added"))
        .catch(logAndReject("critical", "Fatal error while adding middlewares"));
};

/**
 * Create a service exports with given context
 * @param {Object} config - Current config
 * @return {Promise<Object>} New service having models and middlewares
 */
exports.createService = function(config) {
    log("info", "Creating service instance...");
    const service = express();
    return exports.addMiddlewares(config, service)
        .then(() => logAndResolve("info", "Service instance created", service))
        .catch(logAndReject("critical", "Fatal error while creating the service instance"));
};

/**
 * Start a service exports
 * @param {Object} config - Config reference
 * @param {Object} service - Service reference
 * @return {Promise<Object>} Started service
 */
exports.startService = function(config, service) {
    const port = config.service.port;
    log("info", `Starting service exports on port ${port}...`);
    return new BPromise(function(resolve, reject) {
            try {
                service.listen(port, (error) => (error) ?
                    reject(error) :
                    resolve());
            } catch (error) {
                reject(error);
            }
        })
        .then(logAndResolve("info", "Service exports successfully started"))
        .catch(logAndReject("critical", "Error while starting the service exports"));
};

/**
 * The holy function at the beginning of everything
 * @param {Object} config - Current configuration
 * @return {Promise<Object>} Started service
 **/
exports.main = function(config) {
    log("info", "Hi ! Welcome to Semverse !");
    log("info", "Please wait while I prepare everything :3");
    return exports.createService(config)
        .then((service) => exports.startService(config, service))
        .catch(logAndReject("critical", "Fatal error :("));
};

// This section is only for service execution
/* istanbul ignore if */
if (process.env.NODE_ENV === "production") {
    exports.main(config);
}
