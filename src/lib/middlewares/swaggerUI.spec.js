"use strict";

const path = require("path");

const {
    t,
    prepareStubs,
    nullFnHO,
    throwFnHO
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./swaggerUI"));

t("Swagger UI Middleware", function(t) {

    t("factory()", function(t) {
        t.test("when there is an error", (t) =>
            m({}).factory({
                utils: {
                    getLogger: throwFnHO
                }
            })
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({
                swaggerUI: nullFnHO
            })
            .factory({
                utils: {
                    getLogger: nullFnHO
                }
            })
            .then((fn) => t.equal(
                typeof fn,
                "function",
                "should return a promise fulfilled with a function"))
        );
    });

});
