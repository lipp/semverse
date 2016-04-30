"use strict";

const test = require("blue-tape");
const m = require("../../../../lib/middlewares/index");
const nullFn = () => null;
const lodash = require("lodash/fp");

test("Middleware manager", (t) => {
    test("getPort() ", (t) => {
        t.equal(typeof m.getPort, "function", "should be a function");
        t.throws(() => m.getPort(), "should throw when given an invalid context");
        t.equal(m.getPort({
                get: (a, b) => b[a]
            }, {
                port: 1
            }), 1,
            "should get the config port when given valid context");
        t.end();
    });
    test("mwInit()", (t) => {
        t.equal(typeof m.mwInit, "function", "should be a function");
        t.end();
    });
    test("mwInit()", (t) =>
        t.shouldFail(m.mwInit(), TypeError, "should reject empty calls"));
    test("mwInit()", (t) =>
        m.mwInit(lodash.defaults({}, lodash, { requireModule: a => a }), {
            use: nullFn
        }, {
            middlewareList: [() => 'A', () => 'B']
        }, nullFn)
        .then((result) => t.equal(result, true, "should initialize middlewares"))
    );
    t.end();
});
