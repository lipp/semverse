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

executeTests("Page Not Found Middleware", [{
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
        should: "return a promise fulfilled with a middleware function",
        test: (test) => test((t) =>
            m({
                utils: {
                    getLogger: nullFnHO,
                    sendBack: nullFn
                }
            }, {})
            .then((fn) => fn(null, null, () => t.pass("")))
        )
    }]
}]);
