/**
 * ### Sequelize Model loader
 *
 * This module instanciates a memory database by using Sequelize ORM
 * All other modules in this folder will considered as models
 *
 * @module Models/Loader
 */
"use strict";

const path = require("path");
const fs = require("fs");

const {
    filter,
    flow,
    tap,
    map,
    endsWith
} = require("lodash/fp");
const BPromise = require("bluebird");

// Soon...
//const Sequelize = require("sequelize");
//const sequelize = new Sequelize("databaseLocation", "username", "password");

const utils = require(path.resolve(__dirname, "../lib/utils"));
const log = utils.log;
const logAndResolve = utils.logAndResolve;
const logAndReject = utils.logAndReject;

/**
 * Retrieve all models in the current folder (*.js only)
 * @return {Promise<Array<String>>} All models in the current folder
 */
exports.retrieveModels = function() {
    const readdirAsync = BPromise.promisify(fs.readdir);
    return readdirAsync(path.resolve(__dirname))
        .then((files) => filter(
            (file) => endsWith(".js", file) && !file.includes(".spec") && file !== "index.js",
            files))
        .catch(logAndReject("error", "An error happened while browsing models"));
};

/**
 * Model loader
 * Retrieve, require and instanciate all models from current folder
 * @param {Object} - Current context
 * @return {Promise<Object>} Fulfilled when all middlewares are initialized
 */
exports.loadModels = function() {
    const models = {};
    log("info", "Loading models...");
    // Retrieve the model list from the current folder
    return exports.retrieveModels()
        .then(flow(
            // Log it
            tap((modelList) => log("debug", `Model list: ${JSON.stringify(modelList)}`)),
            // Require everything
            map((name) => require(utils.getModulePath(path.join("models", name)))),
            // Wait for all initializations to resolve
            (modelPromises) => BPromise.all(modelPromises)))
        // Then register them in this exports
        .then(map(function(model) {
            models[model.name] = model;
            return model;
        }))
        .then(() => logAndResolve("info", "Successfully intitialized models", models))
        .catch(logAndReject("error", "Error while loading models"));
};


// This section is only for service execution
/* istanbul ignore if */
if (process.env.NODE_ENV === "production") {
    exports.models = exports.loadModels();
}
