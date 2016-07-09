"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Error Middleware", [{
    name: "module.exports()",
    assertions: [{
        when: "...everytime",
        should: "mutate the response",
        test: (test) => test(function(t) {
            t.plan(3);
            const res = {};
            m({
                    utils: {
                        sendBack: function(a) {
                            a.status = 500;
                            a.body = "foo";
                        }
                    }
                })
                ("bar", null, res, function(err) {
                    t.equal(err, "bar");
                    t.equal(res.status, 500);
                    t.equal(res.body, "foo");
                });
        })
    }]
}]);
