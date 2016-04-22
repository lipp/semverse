'use strict';

const test = require('tape');
const testedModule = require('../../../../lib/middlewares/error');

test('Error manager', (t) => {
    t.plan(3);
    const f = testedModule;
    t.equal(typeof f, 'function', 'should be a function');
    t.equal(typeof f(null, null, () => true), 'function', 'should return a function');
    {
        let bool;
        const temp = f(null, null, () => bool = true);
        bool = false;
        temp(new Error('Test'), null, null, () => true);
        t.equal(bool, true, 'should return a function that logs errors');
    }
});
