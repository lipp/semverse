"use strict";

const path = require("path");

const lodash = require("lodash");
const test = require("tape");
const proxyquire = require("proxyquire");

// Export blue-tape Test function
/**
 * Returns a curried function that will execute a test with a merged
 * description
 * @param {String} blockDescription Test block description
 * @param {String} testDescription Test description
 * @param {Function} cb Callback call with blue-tape 't' object
 * @return {CurriedFunction} Unit test function
 */
exports.unitTest = lodash.curry(
    function unitTest(blockDescription, testDescription, cb) {
        return test(`${blockDescription} : ${testDescription}`, cb);
    });

/**
 * Returns a curried function that will execute several tests with a merged
 * description
 * @param {String} moduleDescription Module description
 * @param {String} blockDescription Test block description
 * @return {CurriedFunction} Test block function
 */
exports.testBlock = lodash.curry(
    function testBlock(moduleDescription, blockDescription, cb) {
        return cb(
            exports.unitTest(`${moduleDescription} - ${blockDescription}`)
        );
    });

/**
 * Returns a curried function that will host several tests block with a merged
 * description
 * @param {String} moduleDescription Module description
 * @param {String} blockDescription Test block description
 * @return {CurriedFunction} Test block function
 */
exports.testModuleBlock = function testModuleBlock(moduleDescription, cb) {
    return cb(
        exports.testBlock(moduleDescription)
    );
}

/**
 * Returns null
 * @return {Null}                   Null
 */
exports.nullFn = function nullFn() {
    return null;
}

/**
 * Returns a function that returns null
 * @return {Function} Function that returns null
 */
exports.nullFnHO = function nullFnHO() {
    return () => exports.nullFn();
}

/**
 * Throws an Error
 * @param {String} error Error message
 * @return {Error} Error thrown
 */
exports.throwFn = function throwFn(error) {
    throw new Error(error);
}

/**
 * Returns a function that throws an Error
 * @param  {String} error Error message
 * @return {Function} Function that throws an error
 */
exports.throwFnHO = function throwFnHO(error) {
    return () => exports.throwFn(error);
}

/**
 * Returns a resolved Promise
 * @param  {String} value Resolved value
 * @return {Promise.Mixed} Promise resoved with given value
 */
exports.resolveFn = function resolveFn(value) {
    return Promise.resolve(value);
}

/**
 * Returns a function that return a resolved Promise with given value
 * @param  {String} value Resolved value
 * @return {Function} Function that return a resolved Promise with given value
 */
exports.resolveFnHO = function resolveFnHO(value) {
    return () => exports.resolveFn(value);
}

/**
 * Returns a rejected Promise
 * @param  {String} reason Rejection reason
 * @return {Promise.Mixed} Promise rejected with given reason
 */
exports.rejectFn = function rejectFn(reason) {
    return Promise.reject(reason);
}

/**
 * Returns a function that return a rejected Promise with given reason
 * @param  {String} reason Rejection reason
 * @return {Function} Function that return a rejected Promise with given reason
 */
exports.rejectFnHO = function rejectFnHO(reason) {
    return () => exports.rejectFn(reason);
}

/**
 * Returns a function that throw a "Please stub this function" error
 * @param  {String} fnName Function name
 * @return {Promise.Mixed} "Please stub this function" error
 */
exports.stubMe = function stubMe(fnName) {
    return function stubThis() {
        throw new Error("Please stub this function: " + fnName);
    };
}

// Module names, based on project root, to ensure consistency across tests
// @TODO Dynamically build these
exports.express = "express";
exports.config = path.resolve("src/config");
exports.utils = path.resolve("src/lib/utils");
exports.middlewares = path.resolve("src/lib/middlewares");

// Default stubs that will be used across tests
// Any new dependency, and the functions used, must be added here to be stubbed
// @TODO Dynamically build these
const defaultStubs = {
    [exports.express]: exports.stubMe("express"),
    [exports.config]: {
        getService: exports.stubMe("getService")
    },
    [exports.utils]: {
        getLogger: exports.stubMe("getLogger")
    },
    [exports.middlewares]: {
        start: exports.stubMe("start")
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
