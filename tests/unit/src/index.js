"use strict";

const lodash = require("lodash");
const test = require("blue-tape");
const proxyquire = require("proxyquire");

const moduleName = "../../../src/index";

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
const utils = "./lib/utils";
const start = "./lib/middlewares";

const defaultStubs = {
    express: stubMe("express"),
    [config]: {
        getService: stubMe("getService")
    },
    [utils]: {
        getLogger: stubMe("getLogger")
    },
    [start]: stubMe("start")
};

function prepareStubs(customStubs) {
    return proxyquire(moduleName, lodash.merge({}, defaultStubs, customStubs));
}

test("Service starter", function(t) {
    test("main()", function(t) {
        test("main() should reject when an error happens", (t) =>
            t.shouldFail(
                prepareStubs({})
                .main()
            )
        );
        test("main() should resolve when no errors happened", () =>
            prepareStubs({
                express: nullFn,
                [config]: {
                    getService: nullFn
                },
                [utils]: {
                    getLogger: nullFnHO
                },
                [start]: () => Promise.resolve()
            })
            .main()
        );
        t.end();
    });
    t.end();
});
