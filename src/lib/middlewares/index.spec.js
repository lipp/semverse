"use strict";

const path = require("path");

const {
    // Primary test functions
    t,
    prepareInstance,

    // Helpers
    nullFn,
    throwFn,
    resolveFn,
    rejectFn,
    stub
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareInstance(path.resolve(__dirname, "./index"));

t("Middleware loader", function(t) {
    t("registerMiddleware()", function(t) {
        t.test("when given an Express-like service and a middleware", function(t) {
            t.equal(
                m({}).registerMiddleware({
                    use: () => true
                }, null),
                true,
                "should register the middleware in the service");
            t.end();
        });
    });

    t("initMiddleware()", function(t) {
        t.test("when given a middleware", function(t) {
            t.equal(
                m({
                    foo: 'bar'
                }).initMiddleware((a) => a).foo,
                'bar',
                "should call the middleware with the current context");
            t.end();
        });
    });

    t("getPort()", function(t) {
        t.test("when given a context that does not have a config.port property", function(t) {
            t.equal(
                m({}).getPort(),
                9100,
                "should return 9100");
            t.end();
        });
        t.test("when given a context that has a config.port property", function(t) {
            t.equal(
                m({
                    config: {
                        port: 123
                    }
                }).getPort(),
                123,
                "should return the configured port");
            t.end();
        });
    });

    t("loadMiddlewares()", function(t) {
        t.test("when there is an error", function(t) {
            const testModule = m({
                config: {
                    middlewareList: ['foo']
                },
                utils: {
                    requireFromProjectRoot: nullFn
                }
            });
            stub(testModule, 'initMiddleware', rejectFn);
            return testModule
                .loadMiddlewares()
                .catch(() => t.pass("should return a rejected promise"))
                .finally(function() {
                    testModule.initMiddleware.restore();
                });
        });
        t.test("when given an app and a middleware lacking config", function(t) {
            const testModule = m({
                utils: {
                    requireFromProjectRoot: nullFn
                }
            });
            stub(testModule, 'initMiddleware', resolveFn);
            stub(testModule, 'registerMiddleware', nullFn);
            return testModule
                .loadMiddlewares()
                .then(() => t.pass("should return a resolved promise"))
                .finally(function() {
                    testModule.initMiddleware.restore();
                    testModule.registerMiddleware.restore();
                });
        });
        t.test("when given an app and a proper context (config and middleware)", function(t) {
            const testModule = m({
                config: {
                    middlewareList: ['foo']
                },
                utils: {
                    requireFromProjectRoot: (a) => a
                }
            });
            stub(testModule, 'initMiddleware', resolveFn);
            stub(testModule, 'registerMiddleware', (a) => () => a);
            return testModule
                .loadMiddlewares()
                .then(() => t.pass("should return a resolved promise"))
                .finally(function() {
                    testModule.initMiddleware.restore();
                    testModule.registerMiddleware.restore();
                });
        });
    });
    t("startInstance()", function(t) {
        t.test("when there is a synchronous error", function(t) {
            const testModule = m({});
            stub(testModule, 'getPort', throwFn);
            return testModule
                .startInstance()
                .catch(() => t.pass("should return a rejected promise"))
                .finally(function() {
                    testModule.getPort.restore();
                });
        });
        t.test("when there is an asynchronous error", function(t) {
            const testModule = m({});
            stub(testModule, 'getPort', nullFn);
            stub(testModule, 'loadMiddlewares', rejectFn);
            return testModule
                .startInstance()
                .catch(() => t.pass("should return a rejected promise"))
                .finally(function() {
                    testModule.getPort.restore();
                    testModule.loadMiddlewares.restore();
                });
        });
        t.test("when given a valid app instance and a valid context", function(t) {
            const testModule = m({});
            stub(testModule, 'getPort', nullFn);
            stub(testModule, 'loadMiddlewares', resolveFn);
            return testModule
                .startInstance({
                    listen: (ignore, cb) => cb()
                })
                .then(() => t.pass("should return a resolved promise"))
                .finally(function() {
                    testModule.getPort.restore();
                    testModule.loadMiddlewares.restore();
                });
        });
    });
});
