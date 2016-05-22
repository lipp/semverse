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

const m = prepareStubs(path.resolve(__dirname, "./index"));

testModuleBlock("Middleware loader", (testBlock) => {
    testBlock("start()", (unitTest) => {
        unitTest("since it's not implemented yet", (t) => {
            t.notEqual(
                typeof m({
                    [utils]: { tbd: () => null }
                }).start,
                undefined,
                "should be defined");
            t.end();
        });
    });
});
