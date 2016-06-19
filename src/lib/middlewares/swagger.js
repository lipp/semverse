/**
 * ### Swagger Middleware
 *
 * This middleware handles Swagger logic
 *
 * @module Middlewares/Swagger
 */
"use strict";

const lodash = require("lodash/fp");
const BPromise = require("bluebird");

const swaggerTools = require("swagger-tools");


/**
 * Initialize Swagger Middleware
 * @param  {Object} context - Current context
 * @return {Promise<Array>} Swagger Middleware functions list
 */
exports.factory = (context) => new BPromise(
    function(resolve, reject) {
        try {
            const get = lodash.get;
            const config = get("config.swagger", context);

            const getLogger = get("utils.getLogger", context);
            const log = getLogger(context);

            const getModulePath = get("utils.getModulePath", context);
            const controllers = require(getModulePath("api/controllers"));
            const spec = require(getModulePath("api/swagger.json"));
            const entityInstance = get("entities.factory", controllers)(context);

            log("info", "Adding Swagger middleware");

            swaggerTools.initializeMiddleware(spec, (swaggerMiddleware) => resolve([
                swaggerMiddleware.swaggerMetadata(),
                swaggerMiddleware.swaggerValidator({
                    validateResponse: get("validateResponse", config) || true
                }),
                swaggerMiddleware.swaggerRouter({
                    useStubs: get("useStubs", config) || false,
                    controllers: {
                        entities_listEntities: entityInstance.listEntities,
                        entities_createEntity: entityInstance.createEntity
                    }
                }),
                swaggerMiddleware.swaggerUi({
                    apiDocs: get("apiDocs", config) || "/api-spec",
                    swaggerUI: get("swaggerUI", config) || "/docs"
                })
            ]));
        } catch (error) {
            reject(error);
        }
    });
