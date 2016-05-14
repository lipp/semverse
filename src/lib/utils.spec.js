"use strict";

const path = require("path");

const {
    // Primary test functions
    testModuleBlock,
    prepareStubs,

    // Helpers
    nullFn,
    nullFnHO,
    throwFn,
    throwFnHO,
    resolveFn,

    // Dependencies to stub
    express,
    config,
    utils,
    middlewares
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./utils"));

testModuleBlock("Utils library", (testBlock) => {
    testBlock("getLogger()", (unitTest) => {
        unitTest("since it's not implemented yet", (t) => {
            t.throws(
                m({}).getLogger,
                "should throw an error");
            t.end();
        });
    });
});
