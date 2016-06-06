"use strict";

const path = require("path");

const {
    t,
    prepareStubs,
    nullFn,
    nullFnHO,
    throwFnHO
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./error"));

t("Error Middleware", function(t) {

    t("factory()", function(t) {
        t.test("when there is an error", (t) =>
            m({}).factory({
                utils: {
                    getLogger: throwFnHO
                }
            })
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({}).factory({
                utils: {
                    getLogger: nullFnHO,
                    sendBack: nullFn
                }
            })
            .then((fn) => fn('foo', null, null, (a) => t.equal(a, 'foo',
                "should return a promise fulfilled with an Express Error Middleware")))
        );
    });

});