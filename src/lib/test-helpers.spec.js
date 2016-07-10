"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn,
    resolveFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Test helpers library", [{
    name: "unitTest()",
    assertions: [{
        when: "given a unit test",
        should: "call its test engine",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}).unitTest(() => true, "")(nullFn),
                true)
        ))
    }]
}, {
    name: "idFn()",
    assertions: [{
        when: "given any input",
        should: "return the same value",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}).idFn("foo"),
                "foo")
        ))
    }]
}, {
    name: "nullFn()",
    assertions: [{
        when: "given any input",
        should: "return null",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}).nullFn(),
                null)
        ))
    }]
}, {
    name: "nullFnHO()",
    assertions: [{
        when: "given any input",
        should: "return a function that returns null",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}).nullFnHO()(),
                null)
        ))
    }]
}, {
    name: "thrownFn()",
    assertions: [{
        when: "given any input",
        should: "throw an error",
        test: (test) => test((t) => resolveFn(
            t.throws(
                m({}).throwFn)
        ))
    }]
}, {
    name: "throwFnHO()",
    assertions: [{
        when: "given any input",
        should: "return a function that throws an error",
        test: (test) => test((t) => resolveFn(
            t.throws(
                m({}).throwFnHO())
        ))
    }]
}, {
    name: "resolveFn()",
    assertions: [{
        when: "given any input",
        should: "return a resolved Promise",
        test: (test) => test((t) => resolveFn(
            m({}).resolveFn()
            .then(() => t.pass(""))
        ))
    }]
}, {
    name: "resolveFnHO()",
    assertions: [{
        when: "given any input",
        should: "return a function that returns a resolved Promise",
        test: (test) => test((t) => resolveFn(
            m({}).resolveFnHO()()
            .then(() => t.pass(""))
        ))
    }]
}, {
    name: "rejectFn()",
    assertions: [{
        when: "given any input",
        should: "return a rejected Promise",
        test: (test) => test((t) => resolveFn(
            m({}).rejectFn()
            .catch(() => t.pass(""))
        ))
    }]
}, {
    name: "rejectFnHO()",
    assertions: [{
        when: "its returned function is not given a rejection reason",
        should: "return a function that returns the base reason",
        test: (test) => test((t) =>
            m({}).rejectFnHO("foo")()
            .catch((rejection) => t.equal(
                rejection.message,
                "foo"))
        )
    }, {
        when: "its returned function is given a rejection reason",
        should: "return a function that returns the given reason",
        test: (test) => test((t) =>
            m({}).rejectFnHO("foo")("bar")
            .catch((rejection) => t.equal(
                rejection.message,
                "bar"))
        )
    }]
}, {
    name: "createResponseMock()",
    assertions: [{
        when: "...actually everytime",
        should: "return an object that has a status method which alter the response status",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}).createResponseMock().status("foo").status,
                "foo")
        ))
    }, {
        when: "...actually everytime",
        should: "return an object that has a json method which alter the response body",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({}).createResponseMock().json("foo").body,
                "foo")
        ))
    }]
}]);
