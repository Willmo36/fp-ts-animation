"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("fp-ts/lib/function");
exports.URI = "Animation_";
function runnable(value0, value1) {
    return { type: "Runnable", value0: value0, value1: value1 };
}
exports.runnable = runnable;
exports.trivial = { type: "Trivial" };
exports.cancelled = { type: "Cancelled" };
function fold(onRunnable, onTrivial, onCancelled) {
    return function (fa) {
        switch (fa.type) {
            case "Runnable":
                return onRunnable(fa.value0, fa.value1);
            case "Trivial":
                return onTrivial();
            case "Cancelled":
                return onCancelled();
        }
    };
}
exports.fold = fold;
exports.duration = function (dur) { return runnable(dur, function_1.identity); };
//# sourceMappingURL=index.js.map