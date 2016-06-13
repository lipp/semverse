"use strict";

const path = require("path");

const {
    t,
    prepareStubs,
    nullFn,
    nullFnHO,
    throwFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./swagger"));

t("Swagger Middleware", function(t) {

    t("factory()", function(t) {
        t.test("when there is an error", (t) =>
            m({
                swaggerTools: {
                    initializeMiddleware: throwFn
                }
            }).factory({
                utils: {
                    getLogger: nullFnHO
                }
            })
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({
                swaggerTools: {
                    initializeMiddleware: (ignore, cb) => cb({
                        swaggerMetadata: nullFn,
                        swaggerValidator: nullFn,
                        swaggerRouter: nullFn,
                        swaggerUi: nullFn
                    })
                }
            })
            .factory({
                utils: {
                    getLogger: nullFnHO
                }
            })
            .then((fn) => t.equal(
                typeof fn,
                "object",
                "should return a promise fulfilled with an object"))
        );
    });

});
