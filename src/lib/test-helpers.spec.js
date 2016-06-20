"use strict";

const path = require("path");

const {
    t,
    prepareForTests,
    nullFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename, null);

t("Test helpers library", function(t) {

    t("unitTest()", function(t) {
        t.test("when given a unit test", function(t) {
            t.equal(
                m({}).unitTest(() => true, "", "", nullFn),
                true,
                "should call its test engine");
            t.end();
        });
    });

    t("idFn()", function(t) {
        t.test("when given any input", function(t) {
            t.equal(
                m({}).idFn("foo"),
                "foo",
                "should return the same value");
            t.end();
        });
    });

    t("nullFn()", function(t) {
        t.test("when given any input", function(t) {
            t.equal(
                m({}).nullFn(),
                null,
                "should return null");
            t.end();
        });
    });

    t("nullFnHO()", function(t) {
        t.test("when given any input", function(t) {
            t.equal(
                m({}).nullFnHO()(),
                null,
                "should return a function that returns null");
            t.end();
        });
    });

    t("throwFn()", function(t) {
        t.test("when given any input", function(t) {
            t.throws(
                m({}).throwFn,
                "should throw an error");
            t.end();
        });
    });

    t("throwFnHO()", function(t) {
        t.test("when given any input", function(t) {
            t.throws(
                m({}).throwFnHO(),
                "should return a function that throws an error");
            t.end();
        });
    });

    t("resolveFn()", function(t) {
        t.test("when given any input", (t) =>
            m({}).resolveFn()
            .then(() => t.pass("should return a resolved Promise"))
        );
    });

    t("resolveFnHO()", function(t) {
        t.test("when given any input", (t) =>
            m({}).resolveFnHO()()
            .then(() => t.pass("should return a function that returns a resolved Promise"))
        );
    });


    t("rejectFn()", function(t) {
        t.test("when given any input", (t) =>
            m({}).rejectFn()
            .catch(() => t.pass("should return a rejected Promise"))
        );
    });

    t("rejectFnHO()", function(t) {
        t.test("when its returned function is not given a rejection reason", (t) =>
            m({}).rejectFnHO("foo")()
            .catch((rejection) => t.equal(
                rejection,
                "foo",
                "should return a function that returns the base reason"))
        );
        t.test("when its returned function is given a rejection reason", (t) =>
            m({}).rejectFnHO("foo")("bar")
            .catch((rejection) => t.equal(
                rejection,
                "bar",
                "should return a function that returns its given reason"))
        );
    });

    t("createResponseMock()", function(t) {
        t.test("in all cases", function(t) {
            const result = m({}).createResponseMock();
            t.equal(typeof result, "object",
                "should return an object");
            t.equal(result.status("foo").status, "foo",
                "that has a status method which alter the response status");
            t.equal(result.json("foo").body, "foo",
                "and a json method which alter the response body");
            t.end();
        });
    });

});
