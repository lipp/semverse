"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn,
    resolveFn,
    stub
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Middleware loader", [{
    name: "registerMiddleware()",
    assertions: [{
        when: "given an Express-like service and a middleware",
        should: "return a rejected promise",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}).registerMiddleware({
                    use: () => true
                }, null),
                true,
                "")
        ))
    }]
}, {
    name: "loadMiddlewares()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected promise",
        test: (test) => test((t) =>
            m({
                utils: {
                    requireMiddleware: resolveFn
                }
            })
            .loadMiddlewares({
                service: {
                    middlewareList: ["foo"]
                }
            })
            .catch(() => t.pass(""))
        )
    }, {
        when: "given an app and a middleware lacking config",
        should: "return a resolved promise",
        test: (test) => test(function(t) {
            const testModule = m({
                utils: {
                    requireMiddleware: resolveFn
                }
            });
            stub(testModule, "registerMiddleware", nullFn);
            return testModule
                .loadMiddlewares({})
                .then(() => t.pass(""))
                .finally(function() {
                    testModule.registerMiddleware.restore();
                });
        })
    }, {
        when: "given an app and a proper context (config and middleware)",
        should: "return a resolved promise",
        test: (test) => test(function(t) {
            const testModule = m({
                path: {
                    join: () => path.resolve("src/lib/test-helpers")
                },
                utils: {
                    getModulePath: (a) => a
                }
            });
            stub(testModule, "registerMiddleware", (a) => () => a);
            return testModule
                .loadMiddlewares({
                    service: {
                        middlewareList: ["foo"]
                    }
                })
                .then(() => t.pass(""))
                .finally(function() {
                    testModule.registerMiddleware.restore();
                });
        })
    }]
}]);
