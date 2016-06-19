"use strict";

const path = require("path");

const {
    t,
    prepareForTests
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

t("API Controller Loader", function(t) {

    t("Exported module", function(t) {
        t.test("everytime", function(t) {
            t.equal(typeof(m({}, {})),
                "object",
                "should return an object"
            );
            t.end();
        });
    });

});
