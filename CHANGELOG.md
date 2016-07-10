[NEXT VERSION]

[6.0.0]### The Refactor update(part 2)

Well, there goes my context aware modules.I realized that moving around my context reference lead to
function signature obfuscation, worthless complexity, and...bugs.So I got rid of it, came back to simpler, more abstract modules, so that the next iterations will go smoother and the code be cleaner.

Changes are:
    -[REFACTOR]: Rewrote the codebase to be context unaware, the functions to be as pure as possible(more improvements later), and the logs to be anonymous - [FEATURE]: Add environment variables based configuration, to fix Heroku deploys - [FEATURE]: Tests can now be skipped per module(Use ``
        `executeTests.skip`
        ``) - [FEATURE]: Tests can now be skipped per
function(Add ``
    `skip: true`
    `` in function tests definitions)

[5.0.0]### The Refactor update

Things are moving on quite well and all the pieces are slowing coming in place: Swagger is functional, Sequelize will be soon, Still at 100 % coverage and with a framework that will allow me to write good BDD Integration Tests.
Next step is most likely Sequelize, but maybe also a working Heroku deploy process, because
for the moment it just crashes.

Anyway, changes this time are:
    -[REFACTOR]: The whole test framework has been overhauled.I ditched my old one because it was not code - folding friendly, and I wanted to force myself to write structured, self - documented tests, with a when / should syntax.Plus its more FP oriented and that is always a good thing to do
        -[FEATURE]: Update package.json new - version script to remind me to amend version commits - [FEATURE]: Add a true model loader, now we are ready
    for
    Sequelize!
    -[REFACTOR]: Use way less lodash.get, especially
for "must be there"
properties(
    if they are not there, the app should crash asap anyway)

[4.0.0]### Epic update this time!Main changes are:
    -[FEATURE]: Added entity model placeholder(will be replaced by Sequelize) - [REFACTOR]: Removed the need
for naming the tested module in specs.My test
engine will just assume that the tested module is in the same folder and has
the same name(apart from the '.spec'
    bit) - [REFACTOR]: Removed the need to specify project root in each module.Only
this that matters now is the relative path of a module
    - [BONUS]: Better changelogs.This is the first one: D - [BONUS]: A little script, curl - tests.sh that has some examples on how you can
use the API on CLI. - [FEATURE]: Replace SwaggerUI middleware with complete Swagger middleware - [FEATURE]: Add Entities controller

    [3.0.0]### The SwaggerUI update - [FEATURE]: Add Swagger UI middleware

    [2.3.0]### The Documentation update - [FEATURE]: Add documentation(based on jsDoc)

[2.0.0] - [FEATURE]: Add 404 middleware

    [1.0.0] - [FEATURE]: Add Error middleware

    [0.0.1] - [FEATURE]: Add the skeleton(filesystem structure, lots of placeholders and basic npm scripts) - [FEATURE]: Up coverage to 100 %
