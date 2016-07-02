"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Swagger Middleware", [{
    name: "factory()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected promise",
        test: (test) => test((t) =>
            m({}, {})
            .catch(() => t.pass(""))
        )
    }, {
        when: "there is no error",
        should: "return a promise fulfilled with an object",
        test: (test) => test((t) =>
            m({
                config: {
                    swagger: null
                }
            }, {
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
                "object"))
        )
    }]
}]);
