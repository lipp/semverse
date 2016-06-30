"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn,
    nullFnHO,
    throwFnHO
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Error Middleware", [{
    name: "factory()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected promise",
        test: (test) => test((t) =>
            m({
                utils: {
                    getLogger: throwFnHO
                }
            }, {})
            .catch(() => t.pass(""))
        )
    }, {
        when: "there is no error",
        should: "return a promise fulfilled with an Express Error Middleware",
        test: (test) => test((t) =>
            m({
                utils: {
                    getLogger: nullFnHO,
                    sendBack: nullFn
                }
            }, {})
            .then((fn) => fn("foo", null, null, (a) => t.equal(a, "foo",
                "")))
        )
    }]
}]);
