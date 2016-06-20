/**
 * ### Test helpers
 *
 * This module hosts everything needed for tests.
 * Abstraction over the expection engine, abstraction over the basic functions,
 * this module is the Test Toolbelt.
 * Little to no test framework logic should be in unit tests to keep them
 * focused on code documentation.
 *
 * @module Library/Test-Helpers
 */
"use strict";

const path = require("path");

const lodash = require("lodash/fp");
const {
    merge,
    map,
    curry,
    isFunction,
    keys,
    flow
} = lodash;

const BPromise = require("bluebird");

const tape = require("blue-tape");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noPreserveCache().noCallThru();

/**
 * @name unitTest
 * @function
 * @description Returns a curried function that will execute a test with
 * a description pre fed by the parent test block
 * @curried
 * @private
 * @param {Function} testFn - Test engine
 * @param {String} blockDescription - Parent block description
 * @param {String} testDescription - This Test description
 * @param {Function} cb - Callback called with test engine object
 * @return {Function} Atomic test handler
 */
exports.unitTest = curry(
    function unitTest(testFn, blockDescription, testDescription, cb) {
        return testFn(`${blockDescription} : ${testDescription}`, cb);
    });

/**
 * Returns a function that will execute several tests with a concatenated
 * description
 *
 * @public
 * @param {String} parentBlockDescription - Parent block description
 * @param {String} [blockDescription] - This test block description
 * @param {Function} cb - Callback
 * @return {Function} Test block handler
 */
exports.t = function t(parentBlockDescription, blockDescription, cb) {
    let cb2;
    let msg;
    if (isFunction(blockDescription)) {
        cb2 = blockDescription;
        msg = parentBlockDescription;
    } else {
        cb2 = cb;
        msg = `${parentBlockDescription} - ${blockDescription}`;
    }
    const newTestBlock = (b, c) => exports.t(msg, b, c);
    newTestBlock.test = exports.unitTest(tape, msg);
    newTestBlock.skip = exports.unitTest(tape.skip, msg);
    newTestBlock.only = exports.unitTest(tape.only, msg);
    return cb2(newTestBlock);
};

/**
 * Identity function
 *
 * @public
 * @param {Mixed} input - Value to be returned
 * @return {Mixed} Same as input
 */
exports.idFn = function idFn(input) {
    return input;
};

/**
 * Returns null
 *
 * @public
 * @return {Null} Null
 */
exports.nullFn = function nullFn() {
    return null;
};

/**
 * Returns a function that returns null
 *
 * @public
 * @return {Function} Function that returns null
 */
exports.nullFnHO = function nullFnHO() {
    return () => exports.nullFn();
};

/**
 * Throws an Error
 *
 * @public
 * @param {String} error - Error message
 * @return {Error} Error thrown
 */
exports.throwFn = function throwFn(error) {
    throw new Error(error);
};

/**
 * Returns a function that throws an Error
 *
 * @public
 * @param {String} error - Error message
 * @return {Function} Function that throws an error
 */
exports.throwFnHO = function throwFnHO(error) {
    return () => exports.throwFn(error);
};

/**
 * Returns a resolved Promise
 *
 * @public
 * @param {String} value - Resolved value
 * @return {Promise<Mixed>} Promise resoved with given value
 */
exports.resolveFn = function resolveFn(value) {
    return BPromise.resolve(value);
};

/**
 * Returns a function that return a resolved Promise with given value
 *
 * @public
 * @param  {String} value - Resolved value
 * @return {Function} Function that returns a resolved Promise with given value
 */
exports.resolveFnHO = function resolveFnHO(value) {
    return () => exports.resolveFn(value);
};

/**
 * Returns a rejected Promise
 *
 * @public
 * @param  {String} reason - Rejection reason
 * @return {Promise<Mixed>} Promise rejected with given reason
 */
exports.rejectFn = function rejectFn(reason) {
    return BPromise.reject(reason);
};

/*
 * Returns a function that return a rejected Promise with given reason
 *
 * @public
 * @param  {String} reason - Rejection reason
 * @return {Function} Function that return a rejected Promise with given reason
 */
exports.rejectFnHO = function rejectFnHO(reason) {
    return function(otherReason) {
        if (otherReason) {
            return exports.rejectFn(otherReason);
        }
        return exports.rejectFn(reason);
    };
};

// Module names, based on project root, to ensure consistency across tests
exports.swaggerTools = "swagger-tools";
exports.config = path.resolve(__dirname, "../config");
exports.utils = path.resolve(__dirname, "../lib/utils");
exports.middlewareLoader = path.resolve(__dirname, "../lib/middlewares");
exports.models = path.resolve(__dirname, "../models");
exports.controllers = path.resolve(__dirname, "../api/controllers");

// Default stubs that will be used across tests
// Mixed new dependency must be added here to be stubbed
const noCallThru = {
    "@noCallThru": true
};
const defaultStubs = {
    // External dependencies
    path: path,
    lodash: lodash,
    tape: noCallThru,
    proxyquire: proxyquire,
    express: noCallThru
};
// Internal dependencies
map(function(dep) {
    defaultStubs[dep] = noCallThru;
}, [
    exports.swaggerTools,
    exports.config,
    exports.utils,
    exports.middlewareLoader,
    exports.models,
    exports.controllers
]);

// Default that will be used for factories
// Mixed new dependency must be added here to be stubbed
const defaultContext = {
    utils: {
        getLogger: exports.nullFnHO,
        getModulePath: require(exports.utils).getModulePath,
        logAndReject: exports.rejectFnHO
    }
};

/**
 * Convert an object into another object with computed properties by using the given
 * object properties names as variables declared in this module
 * For example, given an object { a: "foo", b: "bar" }
 * this function will return an object { [a]: "foo", [b]: "bar" } with a and b
 * eventually defined as variables in this module.
 * If they are not defined, this function will assume that they refer to node
 * modules instead of local ones.
 *
 * @private
 * @param  {Object} object - Input object
 * @return {Object} Converted object
 */
exports.convertIntoComputedProperties = function convertIntoComputedProperties(object) {
    const newObj = {};
    const objKeys = keys(object);
    map(function(property) {
            if (exports[property]) {
                newObj[exports[property]] = object[property];
            } else {
                newObj[property] = object[property];
            }
        },
        objKeys
    );
    return newObj;
};

/**
 * Require a module with some of its dependencies stubbed with given stubs that
 * may overload the default ones.
 *
 * @private
 * @param {String} moduleName - Module name to proxiquire
 * @param {Object} customStubs - Custom stubs for the proxified module
 * @return {Mixed} Proxified module
 */
exports.requireWithStubs = function requireWithStubs(moduleName, customStubs) {
    return proxyquire(moduleName, flow(
        merge(exports.convertIntoComputedProperties(customStubs)),
        merge(defaultStubs)
    )({}));
};

/**
 * Create a new instance from a given module factory with a given context that
 * may overload the default one.
 *
 * @private
 * @param {Object} module - Module object
 * @param {Object} customContext - Custom context for the module factory
 * @return {Mixed} New instance
 */
exports.createInstance = function createInstance(module, customContext) {
    return module.factory(flow(
        merge(customContext),
        merge(defaultContext)
    )({}));
};

/**
 * @name prepareForTests
 * @description Prepare a module for tests by requiring it with stubs and
 * eventually creating an instance from its factory if it has any.
 * Module name is based on the given fileName which is the test file name that
 * will consume the prepared module.
 *
 * @public
 * @curried
 * @param {String} testFileName - Test file name
 * @param {Object} customContext - Custom context for the proxified module
 * factory, if it has one. Ignored if the module has no factory
 * @param {Object} customStubs - Custom stubs for the proxified module
 * @return {Mixed} Proxified module, or proxified module instance, if the
 * module has a factory
 */
exports.prepareForTests = curry(
    function prepareForTests(testFileName, customContext, customStubs) {
        const moduleName = testFileName.replace(".spec", "");
        const module = exports.requireWithStubs(moduleName, customStubs);
        if (isFunction(module.factory)) {
            return exports.createInstance(module, customContext);
        }
        return module;
    });

// Abstract Sinon.js in tests
exports.stub = sinon.stub;
exports.spy = sinon.spy;

/**
 * Create an Express-like response mock
 *
 * @public
 * @return {Object} Response mock
 */
exports.createResponseMock = function createResponseMock() {
    const response = {};
    response.status = function(status) {
        response.status = status;
        return response;
    };
    response.json = function(body) {
        response.body = body;
        return response;
    };
    return response;
};
