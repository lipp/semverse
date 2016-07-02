/**
 * ### Test helpers
 *
 * This module hosts everything needed for tests.
 * Abstraction over the expection engine, abstraction over the basic functions,
 * this module is the Test toolbelt.
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
    isFunction,
    keys,
    flow,
    curry
} = lodash;

const BPromise = require("bluebird");

const tape = require("blue-tape");
const sinon = require("sinon");
const proxyquire = require("proxyquire").noPreserveCache().noCallThru();

/**
 * Return a function that will execute a test with a given description
 * @param {Function} testFn - Test engine
 * @param {String} testDescription - Unit test description
 * @param {Function} cb - Callback called with test engine object
 * @return {Function} Unit test handler
 */
exports.unitTest = (testFn, testDescription) => (cb) =>
    testFn(`${testDescription}`, cb);

/**
 * Returns a function that will perform several tests, each with a concatenated
 * description.
 * Descriptions will be concatenated to form a test statement that will have this
 * structure: "Module - Function(): When XXXXXXXXX, it should YYYYYYYYY
 * @param {String} moduleName - Tested module description
 * @param {Array<Object>} assertions - Assertion array to perform
 * @return {Array} Assertions execution results
 */
exports.executeTests = (moduleName, functionBlocks) =>
    map((fn) =>
        map(function(assert) {
            const description = `${moduleName} - ${fn.name}: when ${assert.when}, it should ${assert.should}`;
            const newTest = exports.unitTest(tape, description);
            newTest.skip = exports.unitTest(tape.skip, description);
            newTest.only = exports.unitTest(tape.only, description);
            return assert.test(newTest);
        }, fn.assertions), functionBlocks);

/**
 * Identity function
 * @param {Mixed} input - Value to be returned
 * @return {Mixed} Same as input
 */
exports.idFn = (input) => input;

/**
 * Returns null
 * @return {Null} Null
 */
exports.nullFn = () => null;

/**
 * Returns a function that returns null
 * @return {Function} Function that returns null
 */
exports.nullFnHO = () => exports.nullFn;

/**
 * Throws an Error
 * @param {String} message - Error message
 * @return {Error} Error thrown
 */
exports.throwFn = function throwFn(message) {
    throw new Error(message);
};

/**
 * Returns a function that throws an Error
 * @param {String} message - Error message
 * @return {Function} Function that throws an error
 */
exports.throwFnHO = (message) => () => exports.throwFn(message);

/**
 * Returns a resolved Promise
 * @param {Mixed} value - Resolved value
 * @return {Promise<Mixed>} Promise resolved with given value
 */
exports.resolveFn = (value) => BPromise.resolve(value);

/**
 * Returns a function that return a resolved Promise with given value
 * @param  {Mixed} value - Resolved value
 * @return {Function} Function that returns a resolved Promise with given value
 */
exports.resolveFnHO = (value) => () => exports.resolveFn(value);

/**
 * Returns a rejected Promise
 * @param  {String} reason - Rejection reason
 * @return {Promise<String>} Promise rejected with given reason
 */
exports.rejectFn = (reason) => BPromise.reject(new Error(reason));

/*
 * Returns a function that return a rejected Promise with given reason
 * @param  {String} reason - Rejection reason
 * @return {Function} Function that return a rejected Promise with given reason
 */
exports.rejectFnHO = (reason) => (otherReason) =>
    (otherReason) ? exports.rejectFn(otherReason) : exports.rejectFn(reason);

// Abstracts Sinon.js in tests
exports.stub = sinon.stub;
exports.spy = sinon.spy;

/**
 * Create an Express-like response mock
 * @return {Object} Response mock
 */
exports.createResponseMock = function() {
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

// Stubbable modules, based on project root if project related, to ensure consistency across tests
// Node modules can also go here if they can (and should) be stubbed
exports.bluebird = "bluebird";
exports.swaggerTools = "swagger-tools";

const projectRoot = path.resolve(__dirname, "../");
exports.config = path.join(projectRoot, "config");
exports.utils = path.join(projectRoot, "lib/utils");
exports.middlewareLoader = path.join(projectRoot, "lib/middlewares");
exports.modelLoader = path.join(projectRoot, "models");
exports.entity = path.join(projectRoot, "models/entity");
exports.controllers = path.join(projectRoot, "api/controllers");

// Proxyquire configuration object for stubs (to prevent all calls to the
// original module)
const noCallThru = {
    "@noCallThru": true
};

// Dependencies which have a default stub (that can be overriden)
const defaultStubs = {
    bluebird: BPromise,
    path: path,
    lodash: lodash,
    proxyquire: proxyquire
};

// Dependencies that have to be stubbed (no default)
map(function(dep) {
    defaultStubs[dep] = noCallThru;
}, [
    "fs",
    "tape",
    "express",
    exports.swaggerTools,
    exports.config,
    exports.utils,
    exports.middlewareLoader,
    exports.modelLoader,
    exports.entity,
    exports.controllers
]);

// Defaults stubs that will be used for instance factories
const defaultContext = {
    utils: {
        getLogger: exports.nullFnHO,
        getModulePath: require(exports.utils).getModulePath,
        logAndResolve: () => exports.resolveFnHO,
        logAndReject: () => exports.rejectFnHO
    }
};

/**
 * Convert an object into another object with computed properties by using the given
 * object properties names as variables declared in this module
 * For example, given an object { a: "foo", b: "bar" }
 * this function will return an object { [a]: "foo", [b]: "bar" } with a and b
 * eventually defined as variables in this module.
 * If they are not defined, this function will assume that they refer to node
 * modules instead of local ones during the computed property resolution.
 * @param  {Object} object - Input object
 * @return {Object} Converted object
 */
exports.convertIntoComputedProperties = function(object) {
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
 * Require a module with stubbed dependencies
 * @param {String} moduleName - Module name to proxiquire
 * @param {Object} customStubs - Custom stubs for the proxified module
 * @return {Mixed} Proxified module
 */
exports.requireWithStubs = (moduleName, customStubs) => proxyquire(
    moduleName,
    flow(
        merge(exports.convertIntoComputedProperties(customStubs)),
        merge(defaultStubs)
    )({})
);

/**
 * Create a new instance from a given module factory with a fake context
 * @param {Object} module - Module object
 * @param {Object} customContext - Custom context for the module factory
 * @return {Mixed} New instance
 */
exports.createInstance = (module, customContext) => module.factory(
    flow(
        merge(customContext),
        merge(defaultContext)
    )({})
);

/**
 * @name prepareForTests
 * @description Prepare a module for tests by requiring it with stubs and
 * eventually creating an instance from its factory if it has any.
 * Module name is based on the given test file name that
 * will consume the prepared module.
 * @curried
 * @param {String} testFileName - Test file name
 * @param {Object} customContext - Custom context for the proxified module
 * factory, if it has one. Ignored if the module has no factory
 * @param {Object} customStubs - Custom stubs for the proxified module
 * @return {Mixed} Proxified module, or proxified module instance if the
 * module has a factory
 */
exports.prepareForTests = curry(function(testFileName, customContext, customStubs) {
    const moduleName = testFileName.replace(".spec", "");
    const module = exports.requireWithStubs(moduleName, customStubs);
    if (isFunction(module.factory)) {
        return exports.createInstance(module, customContext);
    }
    return module;
});
