"use strict";

const path = require("path");

const {
    t,
    prepareInstance,
    nullFn,
    nullFnHO,
    throwFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareInstance(path.resolve(__dirname, "./entities"));

t("Entities API Controller", function(t) {

    t("listEntities()", function(t) {
        t.test("when there is an error", (t) =>
            m({
                utils: {
                    getLogger: nullFnHO,
                    logAndReject: nullFn,
                    sendBack: throwFn
                }
            }).listEntities()
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({
                utils: {
                    getLogger: nullFnHO,
                    logAndReject: nullFn,
                    sendBack: nullFn
                }
            }).listEntities()
            .then(() => t.pass("should return a fulfilled promise"))
        );
    });

});
