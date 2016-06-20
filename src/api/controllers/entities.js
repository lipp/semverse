/**
 * ### Entities controller
 *
 * This controller is in charge of handling all publicly exposed entites logic
 *
 * @module API/Controllers/Entities
 */
"use strict";

const {
    get
} = require("lodash/fp");
const BPromise = require("bluebird");

/**
 * Initialize Entities controller instance
 * @param  {Object} context - Current context
 * @return {Object} Entites controller instance
 */
exports.factory = function factory(context) {

    const log = get("utils.getLogger", context)(context);
    const sendBack = get("utils.sendBack", context);
    const logAndReject = get("utils.logAndReject", context)(log);
    const getModulePath = get("utils.getModulePath", context);
    //const path = require("path");
    //const entity = require(path.join(path.resolve(__dirname, "../../"), "models")).entity;
    const models = require(getModulePath("models"));
    const entity = get("entity", models);
    const instance = {};

    /**
     * List entities based on given criterias
     * @param {Object} req - Request reference
     * @param {Object} res - Response reference
     * @return {Promise<Object>} Entities list
     */
    instance.listEntities = function listEntities(ignore, res) {
        return BPromise
            // Placeholder for database management
            .try(() => entity.getAll())
            .then((entities) => sendBack(res, 200, entities))
            .catch((error) => logAndReject(
                `An error happend during listEntities: ${error}`,
                error));
    };

    /**
     * Create an entity
     * @param {Object} req - Request reference
     * @param {Object} res - Response reference
     * @return {Promise<Object>} New entity
     */
    instance.createEntity = function createEntity(req, res) {
        return BPromise
            .try(() => get("body", req))
            .then((body) => entity.create(body))
            .then((result) => sendBack(res, 201, result))
            .catch((error) => logAndReject(
                `An error happend during createEntity: ${error}`,
                error));
    };

    return instance;
};
