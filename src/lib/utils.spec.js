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

const m = prepareForTests(__filename, null);

executeTests("Utils library", [{
    name: "getLogger()",
    assertions: [{
        when: "since it's not implemented yet",
        should: "just not throw for the moment",
        test: (test) => test((t) => resolveFn(
            t.doesNotThrow(
                m({}).getLogger)
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
    name: "requireMiddleware()",
    assertions: [{
        when: "given a middleware name",
        should: "not throw",
        test: (test) => test(function(t) {
            const testedModule = m({
                path: {
                    resolve: nullFn,
                    join: () => path.resolve("src/lib/test-helpers")
                }
            });
            stub(testedModule, "getModulePath", (a) => a);
            t.doesNotThrow(
                testedModule.requireMiddleware);
            t.end();
        })
    }]
}, {
    name: "requireModel()",
    assertions: [{
        when: "given a model name",
        should: "not throw",
        test: (test) => test(function(t) {
            const testedModule = m({
                path: {
                    resolve: nullFn,
                    join: () => path.resolve("src/lib/test-helpers")
                }
            });
            stub(testedModule, "getModulePath", (a) => a);
            t.doesNotThrow(
                testedModule.requireModel);
            t.end();
        })
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
        when: "not given a log function",
        should: "throw",
        test: (test) => test((t) => resolveFn(
            t.throws(() =>
                m({}).logAndResolve(null, null, null, null))
        ))
    }, {
        when: "given a log function",
        should: "return a resolved promise",
        test: (test) => test((t) =>
            m({})
            .logAndResolve(nullFn, null, null, null)
            .then(() => t.pass(""))
        )
    }]
},{
    name: "logAndReject()",
    assertions: [{
        when: "not given a log function",
        should: "throw",
        test: (test) => test((t) => resolveFn(
            t.throws(() =>
                m({}).logAndReject(null, null, null, null))
        ))
    }, {
        when: "given a log function",
        should: "return a rejected promise",
        test: (test) => test((t) =>
            m({})
            .logAndReject(nullFn, null, null, null)
            .catch(() => t.pass(""))
        )
    }]
}]);
