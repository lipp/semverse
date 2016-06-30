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
const {
    get
} = require("lodash/fp");

const utils = require(path.resolve(__dirname, "lib/utils"));
const config = require(path.resolve(__dirname, "config"));
const middlewareLoader = require(path.resolve(__dirname, "lib/middlewares"));
const modelLoader = require(path.resolve(__dirname, "models"));

exports.factory = function(context) {
    const log = context.utils.getLogger();
    const logAndResolve = context.utils.logAndResolve(log);
    const logAndReject = context.utils.logAndReject(log);

    const instance = {};

    /**
     * Add middlewares to the context
     * @return {Promise<Object>} Context copy having middlewares
     **/
    instance.addMiddlewares = function() {
        log("info", "Adding middlewares...");
        return middlewareLoader
            .factory(context)
            .loadMiddlewares()
            .then(logAndResolve("info", "Middlewares added"))
            .catch(logAndReject("critical", "Fatal error while adding middlewares"));
    };

    /**
     * Add models to a context
     * @return {Promise<Object>} Context copy having models
     **/
    instance.addModels = function() {
        log("info", "Adding models...");
        return modelLoader
            .factory(context)
            .loadModels()
            .then(logAndResolve("info", "Models added"))
            .catch(logAndReject("critical", "Fatal error while adding models"));
    };

    /**
     * Create a service instance with given context
     * @return {Promise<Object>} Context copy having service created
     */
    instance.createService = function() {
        log("info", "Creating service instance...");
        context.service = express();
        return instance.addModels()
            .then(() => instance.addMiddlewares())
            .then(logAndResolve("info", "Service instance created"))
            .catch(logAndReject("critical", "Fatal error while creating the service instance"));
    };

    /**
     * Start a service instance
     * @return {Promise<Object>} Context copy having service started
     */
    instance.startService = function() {
        const service = context.service;
        const port = get("config.service.port", context) || 9100;
        log("info", `Starting service instance on port ${port}...`);
        return new BPromise(function(resolve, reject) {
                try {
                    service.listen(port, (error) => (error) ?
                        reject(error) :
                        resolve());
                } catch (error) {
                    reject(error);
                }
            })
            .then(logAndResolve("info", "Service instance successfully started"))
            .catch(logAndReject("critical", "Error while starting the service instance"));
    };

    /**
     * The holy function at the beginning of everything
     * @return {<Promise>Object} New context with a started service
     **/
    instance.main = function() {
        log("info", "Hi ! Welcome to Semverse !");
        log("info", "Please wait while I prepare everything :3");
        return instance.createService()
            .then(instance.startService)
            .catch(logAndReject("critical", "Fatal error :("));
    };

    return instance;
};

// This section is only for service execution
/* istanbul ignore if */
if (process.env.NODE_ENV === "production") {
    const context = {
        utils: utils,
        config: config
    };
    exports.factory(context).main();
}
