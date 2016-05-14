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

testModuleBlock("Service starter", (testBlock) => {
    testBlock("main()", (unitTest) => {
        unitTest("when an error happens", (t) => {
            m({
                    [utils]: {
                        getLogger: throwFnHO
                    }
                })
                .main()
                .then(() => t.fail("should have returned a rejected Promise"))
                .catch(() => t.pass("should return a rejected Promise"))
                .then(t.end);
        });
        unitTest("when no errors happen", (t) => {
            m({
                    [express]: nullFn,
                    [config]: {
                        getService: nullFn
                    },
                    [utils]: {
                        getLogger: nullFnHO
                    },
                    [middlewares]: {
                        start: resolveFn
                    }
                })
                .main()
                .then(() => t.pass("should return a resolved Promise"))
                .catch(() => t.fail("should have returned a resolved Promise"))
                .then(t.end);
        });
    });
});
