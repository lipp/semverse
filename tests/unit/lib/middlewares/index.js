'use strict';

const
    test = require('tape'),
    testedModule = require('../../../lib/utils.js').requireTestedModule(__filename);

test('Middleware manager', (t) => {
    test('start()', (t) => {
        t.equal(!!testedModule, true);
        t.end();
    });
    t.end();
});
