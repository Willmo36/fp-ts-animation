"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipeable_1 = require("fp-ts/lib/pipeable");
//https://bkase.github.io/slides/algebra-driven-design/#/58
//https://github.com/bkase/swift-fp-animations/blob/master/Sources/AnimationsCore/Animations.swift
/**
 * In essence, the animation type is a way to distribute intervals up to the duration
 * linear, swing, tween all are different types of distribution over real time
 * The "result" to the call back is this interval number
 * so for linear of 10s, it'll be 1,2,3,4,5 etc
 * and that callback will be called once per interval with that interval
 *
 * Having this callback, this value, makes the Monad very much like an Observable
 * from this we can decide the functor, applicative and monad instances
 * For example, mapping is f over each interval
 * animation.map(step => IO(render(step))) :: Animation<IO<never>>
 * Above is a series of side effects applying the animation to something
 *
 * ofc the ability to map means the ability to map curried functions, leading to applicative
 * animationA.map(add) :: Animation<Num -> Num>
 *
 * Potential idea - instead of just emitting an interval perhaps have it as a percentage of the initial duration
 * How would this work with a bezier curve though? Where does above 100% before the end? hmmm
 * I guess it'll be another constructor for Animation (Linear | Tween | Bezier Curve)
 *
https://docs.google.com/spreadsheets/d/1PwZPOd5Bm4HbBhETj-56S3CEIRJJjHO7naMTRX7KtQU/edit#gid=0
 *
 */
var A = __importStar(require("./"));
var getAdd = function (sg) { return function (x, y) {
    return pipeable_1.pipe(x, A.fold(function (xDur, xVal) {
        return pipeable_1.pipe(y, A.fold(function (yDur, yVal) {
            var dur = Math.max(xDur, yDur);
            var val = function (prog) {
                var x1 = xVal(prog);
                var y1 = yVal(prog);
                return sg.concat(x1, y1);
            };
            return A.runnable(dur, val);
        }, function () { return x; }, function () { return x; }));
    }, function () {
        return pipeable_1.pipe(y, A.fold(function () { return y; }, function () { return A.trivial; }, function () { return A.trivial; }));
    }, function () {
        return pipeable_1.pipe(y, A.fold(function () { return y; }, function () { return A.trivial; }, function () { return A.cancelled; }));
    }));
}; };
//sequence animation
var mult = function (x, y) {
    return pipeable_1.pipe(x, A.fold(function (xDur, xVal) {
        return pipeable_1.pipe(y, A.fold(function (yDur, yVal) {
            var dur = xDur + yDur;
            var ratio = xDur / dur;
            var val = function (xyProg) {
                //divvy up the progress
                //which "side" of the progress are we in?
                //these are correct
                var xRatio = xDur / xyProg.final;
                var yRatio = 1 - xRatio;
                if (xyProg.value <= xDur && xDur !== 0) {
                    //find the ratio of xDur of xyDur
                    //then multiple xyProg.value by that ratio
                    //to get the percentage through xDur
                    var xPercentage = xyProg.percentage * xRatio;
                    var xProg = {
                        value: xyProg.value,
                        final: xDur,
                        // the 100 here is defo wrong, it should be the "unit" from the driver...
                        percentage: xPercentage
                    };
                    return xVal(xProg);
                }
                else {
                    var yValue = xyProg.value - xDur;
                    var yPercentage = yValue / yDur;
                    var yProg = {
                        value: xyProg.value,
                        final: yDur,
                        percentage: yPercentage
                    };
                    return yVal(yProg);
                }
            };
            return A.runnable(dur, val);
        }, function () { return x; }, function () { return A.cancelled; }));
    }, function () { return y; }, function () { return A.cancelled; }));
};
exports.getSemiringAnimation = function (sg) { return ({
    zero: A.cancelled,
    one: A.trivial,
    add: getAdd(sg),
    mul: mult
}); };
exports.functorAnimation = {
    URI: A.URI,
    map: function (fa, f) {
        return pipeable_1.pipe(fa, A.fold(function (dur, tick) { return A.runnable(dur, function (n) { return f(tick(n)); }); }, function () { return A.trivial; }, function () { return A.cancelled; }));
    }
};
exports.getMonoidAnimation = function (semigroupA) { return ({
    empty: A.trivial,
    concat: getAdd(semigroupA),
}); };
exports.map = pipeable_1.pipeable(exports.functorAnimation).map;
//# sourceMappingURL=instances.js.map