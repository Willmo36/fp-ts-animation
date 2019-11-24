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
//0 - 100 - 0
exports.reversable = function (prog) {
    var p = prog.percentage * 2;
    var p2 = p > 1 ? 2 - p : p;
    return __assign(__assign({}, prog), { percentage: p2 });
};
exports.repeat = function (times) { return function (prog) {
    if (prog.percentage === 1)
        return prog;
    var p = (prog.percentage * (times + 1)) % 1;
    return __assign(__assign({}, prog), { percentage: p });
}; };
exports.backwards = function (prog) { return (__assign(__assign({}, prog), { percentage: 1 - prog.percentage })); };
exports.log = function (msg) { return function (a) {
    console.info(msg, a);
    return a;
}; };
//# sourceMappingURL=combinators.js.map