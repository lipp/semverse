"use strict";

const path = require("path");

const lodash = require("lodash/fp");
const BPromise = require("bluebird");

const tape = require("blue-tape");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noPreserveCache().noCallThru();

/**
 * Returns a curried function that will execute a test with a description
 * pre fed by the parent test block
 * @curried
 * @private
 * @param {Function} testFn - Test engine
 * @param {String} blockDescription - Parent block description
 * @param {String} testDescription - This Test description
 * @param {Function} cb - Callback called with test engine object
 * @return {Function} Atomic test handler
 */
exports.unitTest = lodash.curry(
    function unitTest(testFn, blockDescription, testDescription, cb) {
        return testFn(`${blockDescription} : ${testDescription}`, cb);
    });

/**
 * Returns a function that will execute several tests with a concatenated
 * description
 * @public
 * @param {String} parentBlockDescription - Parent block description
 * @param {String} [blockDescription] - This test block description
 * @param {Function} cb - Callback
 * @return {Function} Test block handler
 */
exports.t = function t(parentBlockDescription, blockDescription, cb) {
    let cb2;
    let msg;
    if (lodash.isFunction(blockDescription)) {
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
 * @param {Mixed} input - Value to be returned
 * @return {Mixed} Same as input
 */
exports.idFn = function idFn(input) {
    return input;
};

/**
 * Returns null
 * @return {Null} Null
 */
exports.nullFn = function nullFn() {
    return null;
};

/**
 * Returns a function that returns null
 * @return {Function} Function that returns null
 */
exports.nullFnHO = function nullFnHO() {
    return () => exports.nullFn();
};

/**
 * Throws an Error
 * @param {String} error - Error message
 * @return {Error} Error thrown
 */
exports.throwFn = function throwFn(error) {
    throw new Error(error);
};

/**
 * Returns a function that throws an Error
 * @param {String} error - Error message
 * @return {Function} Function that throws an error
 */
exports.throwFnHO = function throwFnHO(error) {
    return () => exports.throwFn(error);
};

/**
 * Returns a resolved Promise
 * @param {String} value - Resolved value
 * @return {Promise<Any>} Promise resoved with given value
 */
exports.resolveFn = function resolveFn(value) {
    return BPromise.resolve(value);
};

/**
 * Returns a function that return a resolved Promise with given value
 * @param  {String} value - Resolved value
 * @return {Function} Function that returns a resolved Promise with given value
 */
exports.resolveFnHO = function resolveFnHO(value) {
    return () => exports.resolveFn(value);
};

/**
 * Returns a rejected Promise
 * @param  {String} reason - Rejection reason
 * @return {Promise<Any>} Promise rejected with given reason
 */
exports.rejectFn = function rejectFn(reason) {
    return BPromise.reject(reason);
};

/**
 * Returns a function that return a rejected Promise with given reason
 * @param  {String} reason - Rejection reason
 * @return {Function} Function that return a rejected Promise with given reason
 */
//exports.rejectFnHO = function rejectFnHO(reason) {
//return () => exports.rejectFn(reason);
//};

// Module names, based on project root, to ensure consistency across tests
exports.config = path.resolve("src/config");
exports.utils = path.resolve("src/lib/utils");
exports.middlewareLoader = path.resolve("src/lib/middlewares");

// Default stubs that will be used across tests
// Any new dependency must be added here to be stubbed
const defaultStubs = {

    // External dependencies
    path: path,
    lodash: lodash,
    tape: {
        "@noCallThru": true
    },
    proxyquire: proxyquire,
    express: {
        "@noCallThru": true
    }
};
// Internal dependencies
defaultStubs[exports.config] = {
    "@noCallThru": true
};
defaultStubs[exports.utils] = {
    "@noCallThru": true
};
defaultStubs[exports.middlewareLoader] = {
    "@noCallThru": true
};

/**
 * Require a proxified module with defaultStubs eventually overloaded with
 * custom stubs
 * @param  {String} moduleName - Proxified module name
 * @param  {Object} customStubs - Custom stubs for the proxified module
 * @return {Any} Required proxified module
 */
exports.prepareStubs = lodash.curry(
    function prepareStubs(moduleName, customStubs) {
        return proxyquire(moduleName, lodash.flow(
            lodash.merge(exports.convertIntoComputedProperties(customStubs)),
            lodash.merge(defaultStubs)
        )({}));
    });


// Default that will be used for factories
// Any new dependency must be added here to be stubbed
const defaultContext = {
    utils: {
        getLogger: exports.nullFnHO
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
 * @param  {Object} object - Input object
 * @return {Object} Converted object
 */
exports.convertIntoComputedProperties = function convertIntoComputedProperties(object) {
    const newObj = {};
    const keys = lodash.keys(object);
    lodash.map(function(property) {
            if (exports[property]) {
                newObj[exports[property]] = object[property];
            } else {
                newObj[property] = object[property];
            }
        },
        keys
    );
    return newObj;
};

/**
 * Require a module and create an instance with defaultStubs eventually overloaded with
 * custom context
 * @param  {String} moduleName - Module name
 * @param  {Object} customContext - Custom context for the module factory
 * @return {Object} Required module instance
 */
exports.prepareInstance = lodash.curry(
    function prepareInstance(moduleName, customContext) {
        return require(moduleName).factory(lodash.flow(
            lodash.merge(customContext),
            lodash.merge(defaultContext)
        )({}));
    });

/**
 * Stubbin and spying functions exports
 * To abstract Sinon.js in tests
 */
exports.stub = sinon.stub;
exports.spy = sinon.spy;

/**
 * Create an Express-like response mock
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
