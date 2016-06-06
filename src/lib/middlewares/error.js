"use strict";

const lodash = require("lodash/fp");
const BPromise = require("bluebird");

/* Initialize Error middleware
 * @param  {Object} context - Current context
 * @return {Promise<Function>} Error handler middleware function
 */
exports.factory = (context) => BPromise
    .try(function() {
        const getLogger = lodash.get("utils.getLogger", context);
        const log = getLogger(context);

        const sendBack = lodash.get("utils.sendBack", context);

        log("info", 'Adding Error handler');

        return function errorMiddleware(error, req, res, next) {
            log("error", `An error has not been handled internally ${error.stack}`);
            log("error", `Request was ${lodash.get(req, "method")} / ${lodash.get(req, "path")}`);
            sendBack(res, 500, error);
            next(error);
        };
    });
