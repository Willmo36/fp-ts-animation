"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Animation_1 = require("./Animation");
var pipeable_1 = require("fp-ts/lib/pipeable");
exports.run = function (schedule) { return function (animation) {
    return pipeable_1.pipe(animation, Animation_1.fold(function (duration, tickFn) {
        schedule(function (step) {
            if (step > duration)
                return false;
            var percentage = step / duration;
            tickFn({ value: step, final: duration, percentage: percentage });
            return false;
        });
    }, function () { }, function () { }));
}; };
//# sourceMappingURL=run.js.map