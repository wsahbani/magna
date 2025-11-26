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
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { FileText, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
var processTypeColors = {
    FLOW: "bg-orange-500 text-white",
    SIPOC: "bg-blue-500 text-white",
    BPMN: "bg-green-500 text-white",
};
var statusColors = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
    REVIEW: "bg-yellow-100 text-yellow-700 border-yellow-300",
    APPROVED: "bg-blue-100 text-blue-700 border-blue-300",
    PUBLISHED: "bg-green-100 text-green-700 border-green-300",
    ARCHIVED: "bg-red-100 text-red-700 border-red-300",
};
var statusIcons = {
    DRAFT: FileText,
    REVIEW: Clock,
    APPROVED: CheckCircle,
    PUBLISHED: CheckCircle,
    ARCHIVED: XCircle,
};
var priorityColors = {
    LOW: "bg-green-50 text-green-700 border-green-200",
    MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-200",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    CRITICAL: "bg-red-50 text-red-700 border-red-200",
};
export var ProcessCard = React.forwardRef(function (_a, ref) {
    var process = _a.process, onClick = _a.onClick, onEdit = _a.onEdit, onView = _a.onView, isSelected = _a.isSelected, className = _a.className, props = __rest(_a, ["process", "onClick", "onEdit", "onView", "isSelected", "className"]);
    var typeColorClass = processTypeColors[process.type];
    var statusColorClass = statusColors[process.status];
    var StatusIcon = statusIcons[process.status];
    var priorityColorClass = process.priority ? priorityColors[process.priority] : "";
    return (_jsxs(Card, __assign({ ref: ref, className: cn("process-node cursor-pointer transition-all hover:shadow-lg", isSelected && "process-node selected", className), onClick: onClick }, props, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex items-start gap-2 flex-1 min-w-0", children: [_jsxs("div", { className: cn("px-1.5 py-0.5 rounded text-xs font-medium", typeColorClass), children: ["L", process.level] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(CardTitle, { className: "text-sm leading-tight mb-0.5 truncate", children: process.name }), _jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: process.type })] })] }), _jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [process.priority && (_jsx("div", { className: cn("px-1.5 py-0.5 rounded-full text-xs font-medium border", priorityColorClass), children: process.priority })), _jsxs("div", { className: cn("flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium border", statusColorClass), children: [_jsx(StatusIcon, { className: "h-3 w-3" }), _jsx("span", { className: "hidden sm:inline", children: process.status })] })] })] }), process.description && (_jsx(CardDescription, { className: "mt-1.5 line-clamp-2 text-xs", children: process.description }))] }), _jsx(CardContent, { className: "pt-0", children: _jsxs("div", { className: "space-y-2", children: [process.tags && process.tags.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-1", children: [process.tags.slice(0, 2).map(function (tag, index) { return (_jsx("div", { className: "px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs", children: tag }, index)); }), process.tags.length > 2 && (_jsxs("div", { className: "px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs", children: ["+", process.tags.length - 2] }))] })), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [process.authorName && (_jsxs("div", { className: "flex items-center gap-1 min-w-0", children: [_jsx(User, { className: "h-3 w-3 flex-shrink-0" }), _jsx("span", { className: "truncate", children: process.authorName })] })), process.estimatedDuration && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), _jsxs("span", { children: [process.estimatedDuration, "min"] })] }))] }), process.updatedAt && (_jsx("div", { className: "text-xs flex-shrink-0", children: new Date(process.updatedAt).toLocaleDateString() }))] }), _jsxs("div", { className: "flex items-center gap-2 pt-1", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: function (e) {
                                        e.stopPropagation();
                                        onView === null || onView === void 0 ? void 0 : onView();
                                    }, className: "flex-1 h-7 text-xs", children: "View" }), _jsx(Button, { size: "sm", variant: "orange", onClick: function (e) {
                                        e.stopPropagation();
                                        onEdit === null || onEdit === void 0 ? void 0 : onEdit();
                                    }, className: "flex-1 h-7 text-xs", children: "Edit" })] })] }) })] })));
});
ProcessCard.displayName = "ProcessCard";
export var ProcessGrid = React.forwardRef(function (_a, ref) {
    var processes = _a.processes, selectedProcessId = _a.selectedProcessId, onProcessSelect = _a.onProcessSelect, onProcessEdit = _a.onProcessEdit, onProcessView = _a.onProcessView, className = _a.className;
    return (_jsx("div", { ref: ref, className: cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className), children: processes.map(function (process) { return (_jsx(ProcessCard, { process: process, isSelected: selectedProcessId === process.id, onClick: function () { return onProcessSelect === null || onProcessSelect === void 0 ? void 0 : onProcessSelect(process.id); }, onEdit: function () { return onProcessEdit === null || onProcessEdit === void 0 ? void 0 : onProcessEdit(process.id); }, onView: function () { return onProcessView === null || onProcessView === void 0 ? void 0 : onProcessView(process.id); } }, process.id)); }) }));
});
ProcessGrid.displayName = "ProcessGrid";
