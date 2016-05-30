"use strict";

const path = require("path");

const lodash = require("lodash");
const tape = require("tape");
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
exports._unitTest = lodash.curry(
    function _unitTest(testFn, blockDescription, testDescription, cb) {
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
exports.testBlock = function testBlock(parentBlockDescription, blockDescription, cb) {
    let cb2;
    let msg;
    if (lodash.isFunction(blockDescription)) {
        cb2 = blockDescription;
        msg = parentBlockDescription;
    } else {
        cb2 = cb;
        msg = `${parentBlockDescription} - ${blockDescription}`;
    }
    const newTestBlock = (b, c) => exports.testBlock(msg, b, c);
    newTestBlock.test = exports._unitTest(tape, msg);
    newTestBlock.skip = exports._unitTest(tape.skip, msg);
    newTestBlock.only = exports._unitTest(tape.only, msg);
    return cb2(newTestBlock);
};

/**
 * Returns null
 * @return {Null}                   Null
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
 * @param {String} error Error message
 * @return {Error} Error thrown
 */
exports.throwFn = function throwFn(error) {
    throw new Error(error);
};

/**
 * Returns a function that throws an Error
 * @param  {String} error Error message
 * @return {Function} Function that throws an error
 */
exports.throwFnHO = function throwFnHO(error) {
    return () => exports.throwFn(error);
};

/**
 * Returns a resolved Promise
 * @param  {String} value Resolved value
 * @return {Promise.Mixed} Promise resoved with given value
 */
exports.resolveFn = function resolveFn(value) {
    return Promise.resolve(value);
};

/**
 * Returns a function that return a resolved Promise with given value
 * @param  {String} value Resolved value
 * @return {Function} Function that return a resolved Promise with given value
 */
//exports.resolveFnHO = function resolveFnHO(value) {
//return () => exports.resolveFn(value);
//}

/**
 * Returns a rejected Promise
 * @param  {String} reason Rejection reason
 * @return {Promise.Mixed} Promise rejected with given reason
 */
//exports.rejectFn = function rejectFn(reason) {
//return Promise.reject(reason);
//}

/**
 * Returns a function that return a rejected Promise with given reason
 * @param  {String} reason Rejection reason
 * @return {Function} Function that return a rejected Promise with given reason
 */
//exports.rejectFnHO = function rejectFnHO(reason) {
//return () => exports.rejectFn(reason);
//}

// Module names, based on project root, to ensure consistency across tests
exports.path = "path";
exports.lodash = "lodash";
exports.tape = "tape";
exports.proxyquire = "proxyquire";
exports.express = "express";

exports.config = path.resolve("src/config");
exports.utils = path.resolve("src/lib/utils");
exports.middlewares = path.resolve("src/lib/middlewares");

// Default stubs that will be used across tests
// Any new dependency must be added here to be stubbed
const defaultStubs = {

    // External dependencies
    [exports.path]: path,
    [exports.lodash]: lodash,
    [exports.tape]: {
        '@noCallThru': true
    },
    [exports.proxyquire]: proxyquire,
    [exports.express]: {
        '@noCallThru': true
    },

    // Internal dependencies
    [exports.config]: {
        '@noCallThru': true
    },
    [exports.utils]: {
        '@noCallThru': true
    },
    [exports.middlewares]: {
        '@noCallThru': true
    }
};

/**
 * Require a proxified module with defaultStubs eventually overloaded with
 * custom stubs
 * @param  {String} moduleName Proxified module name
 * @param  {Object} customStubs Custom stubs for the proxified module
 * @return {Object} Required proxified module
 */
exports.prepareStubs = lodash.curry(
    function prepareStubs(moduleName, customStubs) {
        return proxyquire(moduleName, lodash.merge({}, defaultStubs, customStubs));
    });
