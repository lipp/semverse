"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    resolveFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename, null);

executeTests("Config loader", [{
    name: "listEntities()",
    assertions: [{
        when: "...since it's not entirely implemented yet",
        should: "be defined as an object",
        test: (test) => test((t) => resolveFn(
            t.equal(
                typeof m({}),
                "object")
        ))
    }]
}]);
