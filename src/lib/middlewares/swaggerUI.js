/**
 * ### SwaggerUI Middleware
 *
 * This middleware handle Swagger UI access
 *
 * @module Middlewares/Swagger-UI
 */
"use strict";

const lodash = require("lodash/fp");
const BPromise = require("bluebird");

const swaggerUI = require("swagger-tools/middleware/swagger-ui");
const spec = require("../../api/swagger.json");

/**
 * Initialize Swagger UI middleware
 * @param  {Object} context - Current context
 * @return {Promise<Function>} Swagger UI middleware function
 */
exports.factory = (context) => BPromise
    .try(function() {
        const get = lodash.get;
        const config = get("config.swaggerUI", context);
        const getLogger = get("utils.getLogger", context);
        const log = getLogger(context);
        log("info", "Adding swaggerUI middleware");

        return swaggerUI(spec, {
            apiDocs: get("apiDocs", config) || "/api-spec",
            swaggerUI: get("swaggerUI", config) || "/docs"
        });
    });
