"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Page Not Found Middleware", [{
    name: "module.exports()",
    assertions: [{
        when: "...everytime",
        should: "mutate response status",
        test: (test) => test(function(t) {
            t.plan(2);
            const res = {};
            m({
                    utils: {
                        sendBack: function(a) {
                            a.status = 404;
                        }
                    }
                })
                (null, res, function(err) {
                    t.equal(err, undefined);
                    t.equal(res.status, 404);
                });
        })
    }]
}]);
