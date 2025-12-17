import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectTrigger, SelectValue, SelectContent } from './ui/select';
import { Check } from 'lucide-react';
export var ValidatedSelect = function (_a) {
    var value = _a.value, onValueChange = _a.onValueChange, placeholder = _a.placeholder, children = _a.children, showCheckmark = _a.showCheckmark, id = _a.id, _b = _a.className, className = _b === void 0 ? '' : _b;
    var hasValue = showCheckmark !== undefined ? showCheckmark : !!value;
    return (_jsxs("div", { className: "relative", children: [_jsxs(Select, { value: value, onValueChange: onValueChange, children: [_jsx(SelectTrigger, { id: id, className: "h-11 border-gray-300 ".concat(className), children: _jsx(SelectValue, { placeholder: placeholder }) }), _jsx(SelectContent, { children: children })] }), hasValue && (_jsx("div", { className: "absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10", children: _jsx(Check, { className: "w-5 h-5 text-green-600" }) }))] }));
};
