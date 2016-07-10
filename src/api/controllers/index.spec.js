"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    resolveFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("API Controller Loader", [{
    name: "listEntities()",
    assertions: [{
        when: "...actually everytime",
        should: "return an object",
        test: (test) => test((t) => resolveFn(
            t.equal(typeof(m({})),
                "object")
        ))
    }]
}]);
