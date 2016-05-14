"use strict";

const lodash = require("lodash");
const test = require("blue-tape");
const proxyquire = require("proxyquire");

const moduleName = "./index";

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

const utils = "./lib/utils";
const start = "./lib/middlewares";

const defaultStubs = {
    express: stubMe("express"),
    [utils]: {
        getLogger: stubMe("getLogger")
    },
    [start]: stubMe("start")
};

function prepareStubs(customStubs) {
    return proxyquire(moduleName, lodash.merge({}, defaultStubs, customStubs));
}

test("Configuration module", function(t) {
    test("getService()", function(t) {
        test("should throw an error", (t) => {
            t.throws(() =>
                prepareStubs({})
                .getService()
            );
            t.end();
        });
        t.end();
    });
    t.end();
});
