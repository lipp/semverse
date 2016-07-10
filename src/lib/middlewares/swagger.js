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

const path = require("path");

const {
    get
} = require("lodash/fp");
const BPromise = require("bluebird");
const swaggerTools = require("swagger-tools");

const utils = require(path.resolve(__dirname, "../utils"));
const log = utils.log;
const getModulePath = utils.getModulePath;

const config = require(getModulePath("config")).swagger;

const controllers = require(getModulePath("api/controllers"));
const entity = controllers.entities;

const spec = require(getModulePath("api/swagger.json"));

log("info", "Adding Swagger middleware");

module.exports = new BPromise(
    function(resolve, reject) {
        try {
            swaggerTools.initializeMiddleware(
                spec, (swaggerMiddleware) => resolve([
                    swaggerMiddleware.swaggerMetadata(),
                    swaggerMiddleware.swaggerValidator({
                        validateResponse: get("validateResponse", config) || true
                    }),
                    swaggerMiddleware.swaggerRouter({
                        useStubs: get("useStubs", config) || false,
                        controllers: {
                            entities_listEntities: entity.listEntities,
                            entities_createEntity: entity.createEntity
                        }
                    }),
                    swaggerMiddleware.swaggerUi({
                        apiDocs: get("apiDocs", config) || "/api-spec",
                        swaggerUI: get("swaggerUI", config) || "/docs"
                    })
                ])
            );
        } catch (error) {
            reject(error);
        }
    });
