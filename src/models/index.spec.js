"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn,
    rejectFn,
    resolveFnHO,
    stub
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Model loader", [{
    name: "retrieveModels()",
    assertions: [{
        when: "an error happens",
        should: "return a rejected Promise",
        test: (test) => test((t) =>
            m({
                fs: {
                    readdir: (ignore, cb) => cb(new Error('foo'))
                }
            })
            .retrieveModels()
            .catch(() => t.pass(""))
        )
    }, {
        when: "no error happens",
        should: "return a promise fulfilled with a array of .js files only",
        test: (test) => test((t) =>
            m({
                fs: {
                    readdir: (ignore, cb) => cb(null, ["foo.js", "bar.spec.js", "baz.md"])
                }
            })
            .retrieveModels()
            .then((models) => t.deepEqual(
                models, ["foo.js"]))
        )
    }]
}, {
    name: "loadModels()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected promise",
        test: (test) => test(function(t) {
            const testModule = m({});
            stub(testModule, "retrieveModels", rejectFn);
            return testModule
                .loadModels()
                .catch(() => t.pass(""))
                .finally(function() {
                    testModule.retrieveModels.restore();
                });
        })
    }, {
        when: "given an empty models folder",
        should: "return a resolved promise",
        test: (test) => test(function(t) {
            const testModule = m({
                utils: {
                    requireModel: nullFn
                }
            });
            stub(testModule, "retrieveModels", resolveFnHO([]));
            return testModule
                .loadModels()
                .then(() => t.pass(""))
                .finally(function() {
                    testModule.retrieveModels.restore();
                });
        })
    }, {
        when: "given a folder with at least one model",
        should: "return a resolved promise",
        test: (test) => test(function(t) {
            const testModule = m({
                utils: {
                    requireModel: () => ({
                        name: "foo"
                    })
                },
                entity: {}
            });
            stub(testModule, "retrieveModels", resolveFnHO(['entity']));
            return testModule
                .loadModels()
                .then(() => t.pass("should return a resolved promise"))
                .finally(function() {
                    testModule.retrieveModels.restore();
                });
        })
    }]
}]);
