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
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Typography Components
 * Consistent text styling across the application
 */
import * as React from "react";
import { cn } from "../../lib/utils";
export var Heading1 = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (_jsx("h1", __assign({ ref: ref, className: cn("text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight", className) }, props, { children: children })));
});
Heading1.displayName = "Heading1";
export var Heading2 = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (_jsx("h2", __assign({ ref: ref, className: cn("text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight", className) }, props, { children: children })));
});
Heading2.displayName = "Heading2";
export var Heading3 = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (_jsx("h3", __assign({ ref: ref, className: cn("text-base sm:text-lg lg:text-xl font-semibold leading-normal", className) }, props, { children: children })));
});
Heading3.displayName = "Heading3";
export var BodyLarge = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (_jsx("p", __assign({ ref: ref, className: cn("text-sm sm:text-base lg:text-lg font-normal leading-relaxed", className) }, props, { children: children })));
});
BodyLarge.displayName = "BodyLarge";
export var Body = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, _b = _a.as, as = _b === void 0 ? 'p' : _b, props = __rest(_a, ["className", "children", "as"]);
    var Component = as;
    return React.createElement(Component, __assign({ ref: ref, className: cn("text-xs sm:text-sm lg:text-base font-normal leading-normal", className) }, props), children);
});
Body.displayName = "Body";
export var BodySmall = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (_jsx("p", __assign({ ref: ref, className: cn("text-[10px] sm:text-xs lg:text-sm font-normal leading-normal text-gray-600", className) }, props, { children: children })));
});
BodySmall.displayName = "BodySmall";
export var Caption = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (_jsx("span", __assign({ ref: ref, className: cn("text-[10px] sm:text-xs font-normal leading-tight text-gray-500", className) }, props, { children: children })));
});
Caption.displayName = "Caption";
export var Text = React.forwardRef(function (_a, ref) {
    var className = _a.className, children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'body' : _b, as = _a.as, props = __rest(_a, ["className", "children", "variant", "as"]);
    var Component = as || (variant && (variant === 'h1' || variant === 'h2' || variant === 'h3') ? variant : 'p');
    var variantClasses = {
        'h1': 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight',
        'h2': 'text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight',
        'h3': 'text-base sm:text-lg lg:text-xl font-semibold leading-normal',
        'body-large': 'text-sm sm:text-base lg:text-lg font-normal leading-relaxed',
        'body': 'text-xs sm:text-sm lg:text-base font-normal leading-normal',
        'body-small': 'text-[10px] sm:text-xs lg:text-sm font-normal leading-normal text-gray-600',
        'caption': 'text-[10px] sm:text-xs font-normal leading-tight text-gray-500',
    };
    return React.createElement(Component, __assign({ ref: ref, className: cn(variantClasses[variant], className) }, props), children);
});
Text.displayName = "Text";
