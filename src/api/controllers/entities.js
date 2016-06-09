/**
 * ### Entities controller
 *
 * This controller is in charge of handling all publicly exposed entites logic
 *
 * @module API/Controllers/Entities
 */
"use strict";

const lodash = require("lodash/fp");
const BPromise = require("bluebird");
//const models = require("models");

/**
 * Initialize Entities controller instance
 * @param  {Object} context - Current context
 * @return {Object} Entites controller instance
 */
exports.factory = function factory(context) {

    const get = lodash.get;
    const log = get("utils.getLogger", context)(context);
    const sendBack = get("utils.sendBack", context);
    const logAndReject = get("utils.logAndReject", context)(log);

    const instance = {};

    /**
     * List entities based on given criterias
     * @param {Object} req - Request reference
     * @param {Object} res - Response reference
     * @return {Promise<Object>} Entities list
     */
    instance.listEntities = function listEntities(req, res) {
        return BPromise
            .try(() => lodash.get("params.order", req))
            // Placeholder for database management
            //.then(models.entity.create)
            .then(() => ({
                foo: 'bar'
            }))
            .then((entity) => sendBack(res, 200, entity))
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
    //instance.createEntity = function createEntity(req, res) {
    //return BPromise
    //.try(() => lodash.get("body", req))
    //.then(models.entity.create)
    //.then(sendBack(res, 201))
    //.catch((error) => logAndReject(
    //`An error happend during createEntity: ${error}`,
    //error));
    //}
    return instance;
};
