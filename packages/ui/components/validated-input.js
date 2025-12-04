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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from './ui/input';
import { Check } from 'lucide-react';
export var ValidatedInput = function (_a) {
    var showCheckmark = _a.showCheckmark, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["showCheckmark", "className"]);
    var hasValue = showCheckmark !== undefined ? showCheckmark : !!props.value;
    return (_jsxs("div", { className: "relative", children: [_jsx(Input, __assign({}, props, { className: "h-11 pr-10 border-gray-300 text-gray-900 placeholder:text-gray-500 ".concat(className) })), hasValue && (_jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none", children: _jsx(Check, { className: "w-5 h-5 text-green-600" }) }))] }));
};
