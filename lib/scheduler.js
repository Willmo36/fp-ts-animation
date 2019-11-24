"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FRAME = 16;
exports.rafScheduler = function (stepFn, calls) {
    if (calls === void 0) { calls = 0; }
    requestAnimationFrame(function () {
        var cancel = stepFn(FRAME * (calls + 1));
        if (!cancel) {
            exports.rafScheduler(stepFn, calls + 1);
        }
    });
};
exports.immediateScheduler = function (stepFn, calls) {
    if (calls === void 0) { calls = 0; }
    var cancel = stepFn(FRAME * (calls + 1));
    if (!cancel) {
        exports.immediateScheduler(stepFn, calls + 1);
    }
};
//# sourceMappingURL=scheduler.js.map