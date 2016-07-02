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
    get,
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

/**
 * Instanciate Model Loader
 * @param {Object} context - Current context
 * @return {Object} Model loader instance
 */
exports.factory = function(context) {
    const log = context.utils.getLogger();
    const logAndResolve = context.utils.logAndResolve(log);
    const logAndReject = context.utils.logAndReject(log);
    const instance = {};

    /**
     * Retrieve all models in the current folder (*.js only)
     * @return {Promise<Array<String>>} All models in the current folder
     */
    instance.retrieveModels = function retrieveModels() {
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
     * @param {Object} context - Current context
     * @return {Promise<Object>} Fulfilled when all middlewares are initialized
     */
    instance.loadModels = function loadModels() {
        context.models = {};
        log("info", "Loading models...");
        // Retrieve the model list from the current folder
        return instance.retrieveModels()
            .then(flow(
                // Log it
                tap((modelList) => log("debug", `Model list: ${JSON.stringify(modelList)}`)),
                // Require everything
                map(get("utils.requireModel", context)),
                // Call all model factories with sequelize instance to get model instances
                map((model) => model.factory( /*sequelize*/ )),
                // Wait for all initializations to resolve
                (modelPromises) => BPromise.all(modelPromises)))
            // Then register them in this instance
            .then(map(function(model) {
                context.models[model.name] = model;
                return model;
            }))
            .then(() => context)
            .then(logAndResolve("info", "Successfully intitialized models"))
            .catch(logAndReject("error", "Error while loading models"));
    };

    return instance;
};
