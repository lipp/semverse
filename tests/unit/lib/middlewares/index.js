"use strict";

const test = require("blue-tape");
const m = require("../../../../lib/middlewares/index");
const defaultFn = () => null;

test("Middleware manager", (t) => {
    test("getPort() ", (t) => {
        t.equal(typeof m.getPort, "function", "should be a function");
        t.throws(() => m.getPort(), "should reject an empty call");
        t.doesNotThrow(() => m.getPort({
                get: () => {}
            }),
            "should call the 'get' utils function");
        t.end();
    });
    test("mwInit()", (t) => {
        t.equal(typeof m.mwInit, "function", "should be a function");
        t.end();
    });
    test("mwInit()", (t) =>
        t.shouldFail(m.mwInit(), TypeError, "should reject empty calls"));
    test("mwInit()", (t) =>
        m.mwInit({
            get: defaultFn,
            flow: () => () => [Promise.resolve()],
            map: defaultFn,
            tap: defaultFn
        }, {
            use: defaultFn
        }, {}, defaultFn)
        //.then(), {}, "should work work by using expected utils functions");
        //t.end();
    );
    t.end();
});
