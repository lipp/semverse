"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn,
    resolveFn,
    rejectFn,
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
                m({}, {}).registerMiddleware({
                    use: () => true
                }, null),
                true,
                "")
        ))
    }]
}, {
    name: "initMiddleware()",
    assertions: [{
        when: "not given a middleware",
        should: "return a rejected promise",
        test: (test) => test((t) =>
            m({}, {}).initMiddleware()
            .catch(() => t.pass(""))
        )
    }, {
        when: "given a middleware",
        should: "call the middleware with the current context",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({
                    foo: "bar"
                }, {}).initMiddleware({
                    factory: (a) => a
                }).foo,
                "bar")
        ))
    }]
}, {
    name: "loadMiddlewares()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected promise",
        test: (test) => test(function(t) {
            const testModule = m({
                config: {
                    service: {
                        middlewareList: ["foo"]
                    }
                },
                utils: {
                    requireMiddleware: nullFn
                }
            }, {});
            stub(testModule, "initMiddleware", rejectFn);
            return testModule
                .loadMiddlewares()
                .catch(() => t.pass(""))
                .finally(function() {
                    testModule.initMiddleware.restore();
                });
        })
    }, {
        when: "given an app and a middleware lacking config",
        should: "return a resolved promise",
        test: (test) => test(function(t) {
            const testModule = m({
                utils: {
                    requireFromProjectRoot: nullFn
                }
            }, {});
            stub(testModule, "initMiddleware", resolveFn);
            stub(testModule, "registerMiddleware", nullFn);
            return testModule
                .loadMiddlewares()
                .then(() => t.pass(""))
                .finally(function() {
                    testModule.initMiddleware.restore();
                    testModule.registerMiddleware.restore();
                });
        })
    }, {
        when: "given an app and a proper context (config and middleware)",
        should: "return a resolved promise",
        test: (test) => test(function(t) {
            const testModule = m({
                config: {
                    service: {
                        middlewareList: ["foo"]
                    }
                },
                utils: {
                    requireMiddleware: (a) => a
                }
            }, {});
            stub(testModule, "initMiddleware", resolveFn);
            stub(testModule, "registerMiddleware", (a) => () => a);
            return testModule
                .loadMiddlewares()
                .then(() => t.pass(""))
                .finally(function() {
                    testModule.initMiddleware.restore();
                    testModule.registerMiddleware.restore();
                });
        })
    }]
}]);
