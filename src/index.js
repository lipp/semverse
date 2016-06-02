"use strict";

const path = require("path");
const express = require("express");

const BPromise = require("bluebird");

const config = require(path.resolve(__dirname, "./config"));
const utils = require(path.resolve(__dirname, "./lib/utils"));
const middlewareLoader = require(path.resolve(__dirname, "./lib/middlewares"));

/**
 * @name instanciateService
 * @description Instanciate and start Service
 * @param {Object} context - Current context
 * @return {Promise} Fulfilled when service is started
 **/
exports.instanciateService = function instanciateService(context) {
    return BPromise
        .try(function() {
            const log = utils.getLogger();
            log("info", "Instanciating service...");
            const serviceInstance = middlewareLoader.factory(context);
            log("info", "Service instanciated");
            return serviceInstance;
        });
};

/**
 * @name main
 * @description The holy function that will start everything
 * @return {Promise} Fulfilled when service is started
 **/
exports.main = function main() {
    return BPromise
        .try(function() {
            const log = utils.getLogger();
            log("info", `Hi ! Welcome to Semverse !`);
            log("info", `Please wait while I prepare everything :3`);
            const context = {
                utils: utils,
                config: config
            };
            return exports.instanciateService(context);
        })
        .then((serviceInstance) => serviceInstance.startInstance(express()))
        .catch(function(error) {
            const log = utils.getLogger();
            log("critical", `Fatal error: ${error.stack}`);
            return BPromise.reject(error);
        });
};

/* istanbul ignore if */
if (process.env.NODE_ENV === "production") {
    exports.main();
}
