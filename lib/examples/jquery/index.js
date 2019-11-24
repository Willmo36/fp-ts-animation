"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipeable_1 = require("fp-ts/lib/pipeable");
var Animation_1 = require("../../src/Animation");
var index_1 = require("../../src/index");
var run_1 = require("../../src/run");
var scheduler_1 = require("../../src/scheduler");
var combinators_1 = require("../../src/combinators");
function main() {
    var elem = document.getElementById("circle");
    var opacityAnimation = pipeable_1.pipe(Animation_1.duration(5000), index_1.map(exports.opacity));
    var borderRadiusAnimation = pipeable_1.pipe(Animation_1.duration(2000), index_1.map(function (p) { return (__assign(__assign({}, p), { percentage: p.percentage * 0.5 })); }), index_1.map(exports.borderRadius));
    var scaleAnimation = pipeable_1.pipe(Animation_1.duration(2000), index_1.map(combinators_1.repeat(2)), index_1.map(combinators_1.reversable), index_1.map(combinators_1.backwards), index_1.map(exports.scale));
    var all = [
        scaleAnimation,
        opacityAnimation,
        borderRadiusAnimation
    ];
    var animation = pipeable_1.pipe(all.reduce(semiring.add, monoid.empty), index_1.map(exports.render(elem)));
    run_1.run(scheduler_1.rafScheduler)(animation);
}
exports.semigroupStyles = {
    concat: function (x, y) { return (__assign(__assign({}, x), y)); }
};
var semiring = index_1.getSemiringAnimation(exports.semigroupStyles);
var monoid = index_1.getMonoidAnimation(exports.semigroupStyles);
/**
 * jQuery combinators
 */
exports.opacity = function (prog) { return ({
    opacity: prog.percentage
}); };
exports.borderRadius = function (prog) { return ({
    "border-radius": (prog.percentage * 100) + "%"
}); };
exports.scale = function (prog) { return ({
    transform: "scale(" + prog.percentage + "," + prog.percentage + ")"
}); };
exports.render = function (elem) { return function (styles) {
    var record = styles;
    Object.keys(record).map(function (key) {
        $(elem).css(key, record[key]);
    });
}; };
main();
//# sourceMappingURL=index.js.map