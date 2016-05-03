"use strict";

const test = require("blue-tape");
const m = require("../../../../lib/middlewares/index");
const nullFn = () => null;
const lodash = require("lodash/fp");

test("Middleware manager", function (t) {
    test("getPort() ", function (t) {
        t.throws(() => m.getPort(), "should throw when given an invalid context");
        t.equal(m.getPort({
            get: (a, b) => b[a]
        }, {
            port: 1
        }), 1,
                "should get the config port when given valid context");
        t.end();
    });
    test("mwInit()", function (t) {
        t.shouldFail(m.mwInit(), TypeError, "should reject empty calls");
    });
    test("mwInit()", function (t) {
        return m
            .mwInit(lodash.defaults({}, lodash, {requireModule: (a) => a}), {
                use: nullFn
            }, {
                middlewareList: [() => 'A', () => 'B']
            }, nullFn)
            .then((result) => t.equal(result, true, "should initialize middlewares"));
    });
    t.end();
});
