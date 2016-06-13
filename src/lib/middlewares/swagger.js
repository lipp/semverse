/**
 * ### Swagger Middleware
 *
 * This middleware handles Swagger logic
 *
 * @module Middlewares/Swagger
 */
"use strict";

const path = require("path");
const lodash = require("lodash/fp");
const BPromise = require("bluebird");

const swaggerTools = require("swagger-tools");
const spec = require("../../api/swagger.json");

/**
 * Initialize Swagger Middleware
 * @param  {Object} context - Current context
 * @return {Promise<Array>} Swagger Middleware functions list
 */
exports.factory = (context) => BPromise
    .try(function() {
        const get = lodash.get;
        const config = get("config.swagger", context);
        const getLogger = get("utils.getLogger", context);
        const log = getLogger(context);
        log("info", "Adding Swagger middleware");

        return new BPromise(function(resolve, reject) {
            try {
                swaggerTools.initializeMiddleware(spec, (swaggerMiddleware) => resolve([
                    swaggerMiddleware.swaggerMetadata(),
                    swaggerMiddleware.swaggerValidator({
                        validateResponse: get("validateResponse", config) || true
                    }),
                    swaggerMiddleware.swaggerRouter({
                        useStubs: get("useStubs", config) || true
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
    });
