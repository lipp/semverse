"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    nullFn,
    resolveFn,
    spy,
    stub,
    createResponseMock
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

executeTests("Utils library", [{
    name: "log()",
    assertions: [{
        when: "since it's not implemented yet",
        should: "just not throw for the moment",
        test: (test) => test((t) => resolveFn(
            t.doesNotThrow(
                m({}).log)
        ))
    }]
}, {
    name: "getModulePath()",
    assertions: [{
        when: "given a relative path",
        should: "return an absolute path",
        test: (test) => test((t) => resolveFn(
            t.equal(
                m({
                    path: {
                        resolve: () => "/foo/bar"
                    }
                }).getModulePath("baz"),
                "/foo/bar/baz")
        ))
    }]
}, {
    name: "sendBack()",
    assertions: [{
        when: "given an invalid response reference",
        should: "not throw",
        test: (test) => test((t) => resolveFn(
            t.doesNotThrow(() =>
                m({}).sendBack(null, null, null))
        ))
    }, {
        when: "given a valid response reference",
        should: "call both status and json response methods",
        test: (test) => test(function(t) {
            const res = createResponseMock();
            const statusSpy = spy(res, "status");
            const jsonSpy = spy(res, "json");
            m({}).sendBack(res, null, null);
            t.equal(
                statusSpy.called && jsonSpy.called,
                true);
            t.end();
        })
    }]
}, {
    name: "logAndResolve()",
    assertions: [{
        when: "...everytime",
        should: "return a resolved promise",
        test: (test) => test(function(t) {
            const testedModule = m({});
            stub(testedModule, "log", nullFn);
            testedModule
                .logAndResolve(null, null, null)
                .then(function() {
                    t.pass("");
                    t.end();
                });
        })
    }]
}, {
    name: "logAndReject()",
    assertions: [{
        when: "...everytime",
        should: "return a rejected promise",
        test: (test) => test(function(t) {
            const testedModule = m({});
            stub(testedModule, "log", nullFn);
            testedModule
                .logAndReject(null, null, null)
                .catch(function() {
                    t.pass("");
                    t.end();
                });
        })
    }]
}]);
