/**
 * ### Entities controller
 *
 * This controller is in charge of handling all publicly exposed entites logic.
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
exports.factory = function(context) {

    const log = context.utils.getLogger(context);
    const sendBack = context.utils.sendBack;
    const logAndReject = context.utils.logAndReject(log);
    const entity = context.models.entity;

    const instance = {};

    /**
     * List entities based on given criterias
     * @param {Object} req - Request reference
     * @param {Object} res - Response reference
     * @return {Promise<Object>} Entities list
     */
    instance.listEntities = (ignore, res) => BPromise
        .try(() => entity.getAll())
        .then((entities) => sendBack(res, 200, entities))
        .catch(logAndReject("error", "An error happend during listEntities"));

    /**
     * Create an entity
     * @param {Object} req - Request reference
     * @param {Object} res - Response reference
     * @return {Promise<Object>} New entity
     */
    instance.createEntity = (req, res) => BPromise
        .try(() => get("body", req))
        .then((body) => entity.create(body))
        .then((entity) => sendBack(res, 201, entity))
        .catch(logAndReject("error", "An error happend during createEntity"));

    return instance;
};
