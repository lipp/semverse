/**
 * ### Swagger Middleware
 *
 * This middleware handles Swagger logic which means
 *
 *   - It takes care of routing, and calls Swagger controllers (/api/controllers)
 *   for each route;
 *   - It validates both the request and the response, enforcing type checks on
 *   both ends;
 *   - It documents the API
 *   - It serves as a nice UI for manual testing
 *
 * @module Middlewares/Swagger
 */
"use strict";

const {
    get
} = require("lodash/fp");
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
            const log = context.utils.getLogger(context);
            const getModulePath = context.utils.getModulePath;

            const config = context.config.swagger;

            const controllers = require(getModulePath("api/controllers"));
            const entityInstance = get("entities.factory", controllers)(context);

            const spec = require(getModulePath("api/swagger.json"));

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
