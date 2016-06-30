"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    stub,
    nullFn,
    throwFn,
    resolveFn,
    rejectFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Service starter", [{
    name: "addMiddlewares()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected Promise",
        test: (test) => test((t) =>
            m({}, {
                middlewareLoader: {
                    factory: () => ({
                        loadMiddlewares: rejectFn
                    })
                }
            })
            .addMiddlewares()
            .catch(() => t.pass(""))
        )
    }, {
        when: "there are no error",
        should: "return a resolved Promise",
        test: (test) => test((t) =>
            m({}, {
                middlewareLoader: {
                    factory: () => ({
                        loadMiddlewares: resolveFn
                    })
                }
            })
            .addMiddlewares()
            .then(() => t.pass(""))
        )
    }]
}, {
    name: "addModels()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected Promise",
        test: (test) => test((t) =>
            m({}, {
                modelLoader: {
                    factory: () => ({
                        loadModels: rejectFn
                    })
                }
            })
            .addModels()
            .catch(() => t.pass(""))
        )
    }, {
        when: "there are no error",
        should: "return a resolved Promise",
        test: (test) => test((t) =>
            m({}, {
                modelLoader: {
                    factory: () => ({
                        loadModels: resolveFn
                    })
                }
            })
            .addModels()
            .then(() => t.pass(""))
        )
    }]
}, {
    name: "createService()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected Promise",
        test: (test) => test(function(t) {
            const testModule = m({}, {
                express: nullFn
            });
            stub(testModule, "addModels", rejectFn);
            return testModule
                .createService()
                .catch(() => t.pass(""))
                .finally(function() {
                    testModule.addModels.restore();
                });
        })
    }, {
        when: "there are no errors",
        should: "return a resolved Promise",
        test: (test) => test(function(t) {
            const testModule = m({}, {
                express: nullFn
            });
            stub(testModule, "addModels", resolveFn);
            stub(testModule, "addMiddlewares", resolveFn);
            return testModule
                .createService()
                .then(() => t.pass(""))
                .finally(function() {
                    testModule.addModels.restore();
                    testModule.addMiddlewares.restore();
                });
        })
    }]
}, {
    name: "startService()",
    assertions: [{
        when: "the service cannot be started",
        should: "return a rejected Promise",
        test: (test) => test((t) =>
            m({
                service: {
                    listen: throwFn
                }
            }, {})
            .startService()
            .catch(() => t.pass(""))
        )
    }, {
        when: "the service crashes while starting",
        should: "return a rejected Promise",
        test: (test) => test((t) =>
            m({
                service: {
                    listen: (ignore, cb) => cb(new Error("foo"))
                }
            }, {})
            .startService()
            .catch(() => t.pass(""))
        )
    }, {
        when: "the service starts successfully",
        should: "return a resolved Promise",
        test: (test) => test((t) =>
            m({
                service: {
                    listen: (ignore, cb) => cb()
                }
            }, {})
            .startService()
            .then(() => t.pass(""))
        )
    }]
}, {
    name: "main()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected Promise",
        test: (test) => test(function(t) {
            const testModule = m({}, {});
            stub(testModule, "createService", rejectFn);
            return testModule
                .main()
                .catch(() => t.pass(""))
                .finally(() => testModule.createService.restore());
        })
    }, {
        when: "there are no error",
        should: "return a resolved Promise",
        test: (test) => test(function(t) {
            const testModule = m({}, {});
            stub(testModule, "createService", resolveFn);
            stub(testModule, "startService", resolveFn);
            return testModule
                .main()
                .then(() => t.pass(""))
                .finally(function() {
                    testModule.createService.restore();
                    testModule.startService.restore();
                });
        })
    }]
}]);
