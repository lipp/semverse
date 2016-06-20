"use strict";

const path = require("path");

const {
    t,
    prepareForTests,
    nullFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

t("Swagger Middleware", function(t) {

    t("factory()", function(t) {
        t.test("when there is an error", (t) =>
            m({}, {})
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({}, {
                controllers: {
                    entities: {
                        factory: function() {
                            return {
                                listEntities: null,
                                createEntity: null
                            };
                        }
                    }
                },
                swaggerTools: {
                    initializeMiddleware: (ignore, cb) => cb({
                        swaggerMetadata: nullFn,
                        swaggerValidator: nullFn,
                        swaggerRouter: nullFn,
                        swaggerUi: nullFn
                    })
                }
            })
            .then((fn) => t.equal(
                typeof fn,
                "object",
                "should return a promise fulfilled with an object"))
        );
    });

});
