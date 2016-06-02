"use strict";

const path = require("path");

const {
    // Test harness
    t,
    prepareStubs,

    // Helpers
    nullFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareStubs(path.resolve(__dirname, "./test-helpers"));

t("Test helpers library", function(t) {
    t("unitTest()", function(t) {
        t.test("when given a unit test", function(t) {
            t.equal(
                m({}).unitTest(() => true, '', '', nullFn),
                true,
                "should call its test engine");
            t.end();
        });
    });
    t("idFn()", function(t) {
        t.test("when given any input", function(t) {
            t.equal(
                m({}).idFn('foo'),
                'foo',
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
});
