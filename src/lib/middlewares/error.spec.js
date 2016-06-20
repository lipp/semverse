"use strict";

const path = require("path");

const {
    t,
    prepareForTests,
    nullFn,
    nullFnHO,
    throwFnHO
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

t("Error Middleware", function(t) {

    t("factory()", function(t) {
        t.test("when there is an error", (t) =>
            m({
                utils: {
                    getLogger: throwFnHO
                }
            }, {})
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({
                utils: {
                    getLogger: nullFnHO,
                    sendBack: nullFn
                }
            }, {})
            .then((fn) => fn("foo", null, null, (a) => t.equal(a, "foo",
                "should return a promise fulfilled with an Express Error Middleware")))
        );
    });

});
