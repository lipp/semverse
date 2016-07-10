/**
 * ### Entities controller
 *
 * This controller is in charge of handling all publicly exposed entites logic.
 *
 * @module API/Controllers/Entities
 */
"use strict";

const path = require("path");

const {
    get
} = require("lodash/fp");

const BPromise = require("bluebird");

const utils = require(path.resolve(__dirname, "../../lib/utils"));

const logAndReject = utils.logAndReject;
const sendBack = utils.sendBack;

const models = require(utils.getModulePath("models")).models;

/**
 * List entities based on given criterias
 * @param {Object} req - Request reference
 * @param {Object} res - Response reference
 * @return {Promise<Object>} Entities list
 */
exports.listEntities = (ignore, res) => BPromise
    .try(() => models)
    .then((models) => models.entity.getAll())
    .then((entities) => sendBack(res, 200, entities))
    .catch(logAndReject("error", "An error happend during listEntities"));

/**
 * Create an entity
 * @param {Object} req - Request reference
 * @param {Object} res - Response reference
 * @return {Promise<Object>} New entity
 */
exports.createEntity = (req, res) => BPromise
    .all([get("body", req), models])
    .then(function(array) {
        const [body, loadedModels] = array;
        return loadedModels.entity.create(body);
    })
    .then((entity) => sendBack(res, 201, entity))
    .catch(logAndReject("error", "An error happend during createEntity"));
