"use strict";

const path = require("path");

const {
    t,
    prepareForTests
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename, null);

t("Config loader", function(t) {
    //t("getService()", function(t) {
    t.test("since it's not entirely implemented yet", function(t) {
        t.equal(
            typeof m({}), "object",
            "should be defined as an object");
        t.end();
    });
    //});
});
