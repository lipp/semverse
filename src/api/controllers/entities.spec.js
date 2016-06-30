"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn,
    throwFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Entities API Controller", [{
    name: "listEntities()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected promise",
        test: (test) => test(
            (t) => m({
                utils: {
                    sendBack: throwFn
                },
                models: {
                    entity: {
                        getAll: nullFn
                    }
                }
            }, {}).listEntities()
            .catch(() => t.pass(""))
        )
    }, {
        when: "there is no error",
        should: "return a fulfilled promise",
        test: (test) => test(
            (t) => m({
                utils: {
                    sendBack: nullFn
                },
                models: {
                    entity: {
                        getAll: nullFn
                    }
                }
            }, {}).listEntities()
            .then(() => t.pass(""))
        )
    }]
}, {
    name: "createEntity()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected promise",
        test: (test) => test(
            (t) => m({
                utils: {
                    sendBack: throwFn
                },
                models: {
                    entity: {
                        getAll: nullFn
                    }
                }
            }, {}).createEntity()
            .catch(() => t.pass(""))
        )
    }, {
        when: "there is no error",
        should: "return a fulfilled promise",
        test: (test) => test(
            (t) => m({
                utils: {
                    sendBack: nullFn
                },
                models: {
                    entity: {
                        create: nullFn
                    }
                }
            }, {}).createEntity()
            .then(() => t.pass(""))
        )
    }]
}]);
