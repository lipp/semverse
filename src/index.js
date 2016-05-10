"use strict";

const express = require("express");

const config = require("config");
const util = require("lib/util");
const start = require("lib/middlewares");

function main() {
    const log = util.getLogger();
    try {
        log("info", "Starting service...");
        const app = express();
        const serviceConfig = config.getService();
        return start(app, serviceConfig, util);
    } catch (error) {
        log(
            "critical",
            "A critical error happened while starting the service:",
            error
        );
    }
}

exports.main = main;

if (process.env.NODE_ENV !== "test") {
    main();
}
