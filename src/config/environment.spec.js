"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    resolveFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Environment Config loader", [{
    name: "env()",
    assertions: [{
        when: "an environment variable is not declared",
        should: "return undefined",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}, {
                    lodash: {
                        get: () => undefined
                    }
                }).get(),
                undefined)
        ))
    },{
        when: "an environment variable is declared",
        should: "return it",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}, {
                    lodash: {
                        get: () => "foo"
                    }
                }).get(),
                "foo")
        ))
    }]
}]);
