"use strict";

const path = require("path");

const {
    t,
    prepareStubs,
    nullFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./utils"));

t("Utils library", function(t) {
    t("getLogger()", function(t) {
        t.test("since it's not implemented yet", function(t) {
            t.doesNotThrow(
                m({}).getLogger,
                "should just not throw for the moment");
            t.end();
        });
    });
    t("requireFromProjectRoot()", function(t) {
        t.test("when given a module name", function(t) {
            t.doesNotThrow(
                m({
                    path: {
                        resolve: nullFn,
                        join: () => path.resolve("src/lib/test-helpers")
                    }
                }).requireFromProjectRoot,
                "should not throw");
            t.end();
        });
    });
});
