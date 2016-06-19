"use strict";

const path = require("path");

const {
    t,
    prepareForTests,
    stub,
    nullFn,
    nullFnHO,
    throwFnHO,
    rejectFn
} = require(path.resolve("src/lib/test-helpers"));

const m = prepareForTests(__filename, null);

t("Service starter", function(t) {
    t("instanciateService()", function(t) {
        t.test("when an error happens", (t) =>
            m({
                utils: {
                    getLogger: throwFnHO
                }
            })
            .instanciateService()
            .catch(() => t.pass("should return a rejected Promise"))
        );
        t.test("when no errors happen", (t) =>
            m({
                utils: {
                    getLogger: nullFnHO
                },
                middlewareLoader: {
                    factory: () => true
                }
            })
            .instanciateService()
            .then(() => t.pass("should return a resolved Promise"))
        );
    });
    t("main()", function(t) {
        t.test("when an error happens", function(t) {
            const testModule = m({
                utils: {
                    getLogger: nullFnHO
                }
            });
            stub(testModule, "instanciateService", rejectFn);
            return testModule
                .main()
                .catch(() => t.pass("should return a rejected Promise"));
        });
        t.test("when no errors happen", function(t) {
            const testModule = m({
                express: nullFn,
                config: {
                    getService: nullFn
                },
                utils: {
                    getLogger: nullFnHO
                }
            });
            stub(testModule, "instanciateService", () => ({
                startInstance: nullFn
            }));
            return testModule
                .main()
                .then(() => t.pass("should return a resolved Promise"))
                .finally(() => testModule.instanciateService.restore());
        });
    });
});
