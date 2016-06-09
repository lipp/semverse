"use strict";

const path = require("path");

const {
    t,
    prepareStubs,
    nullFn,
    spy,
    createResponseMock
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./utils"));

t("Utils library", function(t) {

    t("getLogger()", function(t) {
        t.test("since it's not implemented yet", function(t) {
            t.doesNotThrow(
                m({}).getLogger,
                "should just not throw for the moment");
            t.end();
        });
    });

    t("requireMiddleware()", function(t) {
        t.test("when given a middleware name", function(t) {
            t.doesNotThrow(
                m({
                    path: {
                        resolve: nullFn,
                        join: () => path.resolve("src/lib/test-helpers")
                    }
                }).requireMiddleware,
                "should not throw");
            t.end();
        });
    });

    t("sendBack()", function(t) {
        t.test("when given an invalid response reference", function(t) {
            t.doesNotThrow(() =>
                m({}).sendBack(null, null, null),
                "should not throw");
            t.end();
        });
        t.test("when given a valid response reference", function(t) {
            const res = createResponseMock();
            const statusSpy = spy(res, "status");
            const jsonSpy = spy(res, "json");
            m({}).sendBack(res, null, null);
            t.equal(
                statusSpy.called && jsonSpy.called,
                true,
                "should call both status and json response methods");
            t.end();
        });
    });

    t("logAndReject()", function(t) {
        t.test("when not given a log function", function(t) {
            t.throws(() =>
                m({}).logAndReject(null, null, null),
                "should throw");
            t.end();
        });
        t.test("when given a log function", (t) =>
            m({})
            .logAndReject(nullFn, null, null)
            .catch(() => t.pass("should return a rejected promise"))
        );
    });

});
