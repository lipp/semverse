"use strict";

const lodash = require("lodash/fp");
const BPromise = require("bluebird");

/* Initialize PageNotFound middleware
 * This is a simple middleware that will answer any request with a 404 error
 * @param  {Object} context - Current context
 * @return {Promise<Function>} PageNotFound middleware function
 */
exports.factory = (context) => BPromise
    .try(function() {
        const get = lodash.get;
        const getLogger = get("utils.getLogger", context);
        const log = getLogger(context);

        const sendBack = get("utils.sendBack", context);

        log("info", 'Adding PageNotFound handler');

        return function pageNotFoundMiddleware(req, res, next) {
            log("error", `A request tried to access an unknown page`);
            log("error", `Request was ${get("method", req)} ${get("path", req)}`);
            sendBack(res, 404);
            next();
        };
    });
