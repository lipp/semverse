"use strict";

const path = require("path");

const {
    t,
    prepareStubs,
    nullFn,
    nullFnHO,
    throwFnHO
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./404"));

t("Page Not Found Middleware", function(t) {

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
            .then(function(fn) {
                return fn(null, null, () =>
                    t.pass("should return a fulfilled promise"));
            })
        );
    });

});
