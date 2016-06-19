"use strict";

const path = require("path");

const {
    t,
    prepareForTests,
    nullFn,
    throwFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename);

t("Entities API Controller", function(t) {

    t("listEntities()", function(t) {
        t.test("when there is an error", (t) =>
            m({
                utils: {
                    sendBack: throwFn
                }
            }, {}).listEntities()
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({
                utils: {
                    sendBack: nullFn
                }
            }, {
                models: {
                    entity: {
                        getAll: nullFn
                    }
                }
            }).listEntities()
            .then(() => t.pass("should return a fulfilled promise"))
        );
    });

    t("createEntity()", function(t) {
        t.test("when there is an error", (t) =>
            m({
                utils: {
                    sendBack: throwFn
                }
            }, {}).createEntity()
            .catch(() => t.pass("should return a rejected promise"))
        );
        t.test("when there is no error", (t) =>
            m({
                utils: {
                    sendBack: nullFn
                }
            }, {
                models: {
                    entity: {
                        create: nullFn
                    }
                }
            }).createEntity()
            .then(() => t.pass("should return a fulfilled promise"))
        );
    });

});
