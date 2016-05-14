"use strict";

const path = require("path");
const lodash = require("lodash");
const test = require("blue-tape");
const proxyquire = require("proxyquire");

const moduleName = path.resolve("src/lib/utils");

function nullFn() {
    return null;
}

function nullFnHO() {
    return () => nullFn;
}

function throwFn() {
    throw new Error("TestError");
}

function rejectFn() {
    return Promise.reject(new Error("TestError"));
}

function stubMe(fnName) {
    return function stubThis() {
        throw new Error("Please stub function " + fnName);
    };
}

const config = "./config";
const start = "./lib/middlewares";

const defaultStubs = {
    express: stubMe("express"),
    [config]: {
        getService: stubMe("getService")
    },
    [start]: stubMe("start")
};

function prepareStubs(customStubs) {
    return proxyquire(moduleName, lodash.merge({}, defaultStubs, customStubs));
}

test("Utils module", function(t) {
    test("getLogger()", function(t) {
        test("should throw an error", (t) => {
            t.throws(
                prepareStubs({})
                .getLogger
            );
            t.end();
        });
        t.end();
    });
    t.end();
});
