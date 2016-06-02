"use strict";

const path = require("path");

const {
    t,
    prepareStubs
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./index"));

t("Config loader", function(t) {
    //t("getService()", function(t) {
        t.test("since it's not implemented yet", function(t) {
            t.deepEqual(
                m({
                }),
                {},
                "should be defined as an empty object");
            t.end();
        });
    //});
});
