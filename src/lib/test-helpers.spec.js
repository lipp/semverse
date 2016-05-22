"use strict";

const path = require("path");

const {
    // Primary test functions
    testModuleBlock,
    prepareStubs,

    // Helpers
    nullFn,

    // Dependencies to stub
    tape
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./test-helpers"));

testModuleBlock("Test helpers library", (testBlock) => {
    testBlock("unitTest()", (unitTest) => {
        unitTest("when given a unit test", (t) => {
            t.equal(
                m({
                    [tape]: nullFn
                }).unitTest('', '', nullFn),
                null,
                "should call Tape");
            t.end();
        });
    });
});
