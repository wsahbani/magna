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
import * as React from "react";
import { Building2, Users, Folder, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "../lib/utils";
var workspaceIcons = {
    GROUPE: Building2,
    ENTITY: Building2,
    DIRECTION: Folder,
    DEPARTMENT: Users,
    TEAM: Users,
};
var workspaceColors = {
    GROUPE: "bg-orange-500 text-white",
    ENTITY: "bg-orange-400 text-white",
    DIRECTION: "bg-blue-500 text-white",
    DEPARTMENT: "bg-green-500 text-white",
    TEAM: "bg-purple-500 text-white",
};
export var WorkspaceCard = React.forwardRef(function (_a, ref) {
    var workspace = _a.workspace, onClick = _a.onClick, isSelected = _a.isSelected, className = _a.className, props = __rest(_a, ["workspace", "onClick", "isSelected", "className"]);
    var Icon = workspaceIcons[workspace.type];
    var iconColorClass = workspaceColors[workspace.type];
    return (_jsxs(Card, __assign({ ref: ref, className: cn("workspace-card cursor-pointer transition-all hover:shadow-lg", isSelected && "workspace-card active border-primary ring-2 ring-primary/20", !workspace.isActive && "opacity-60", className), onClick: onClick }, props, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: cn("p-1.5 rounded-lg", iconColorClass), children: _jsx(Icon, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: workspace.name }), _jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: workspace.type })] })] }), !workspace.isActive && (_jsx("div", { className: "text-xs bg-muted text-muted-foreground px-2 py-1 rounded", children: "Inactive" }))] }), workspace.description && (_jsx(CardDescription, { className: "mt-2 text-sm line-clamp-2", children: workspace.description }))] }), _jsx(CardContent, { className: "pt-2 pb-3", children: _jsx("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: _jsxs("div", { className: "flex items-center gap-3", children: [workspace.processCount !== undefined && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(FileText, { className: "h-3.5 w-3.5" }), _jsx("span", { children: workspace.processCount })] })), workspace.memberCount !== undefined && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Users, { className: "h-3.5 w-3.5" }), _jsx("span", { children: workspace.memberCount })] }))] }) }) })] })));
});
WorkspaceCard.displayName = "WorkspaceCard";
export var WorkspaceGrid = React.forwardRef(function (_a, ref) {
    var workspaces = _a.workspaces, selectedWorkspaceId = _a.selectedWorkspaceId, onWorkspaceSelect = _a.onWorkspaceSelect, className = _a.className;
    return (_jsx("div", { ref: ref, className: cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className), children: workspaces.map(function (workspace) { return (_jsx(WorkspaceCard, { workspace: workspace, isSelected: selectedWorkspaceId === workspace.id, onClick: function () { return onWorkspaceSelect === null || onWorkspaceSelect === void 0 ? void 0 : onWorkspaceSelect(workspace.id); } }, workspace.id)); }) }));
});
WorkspaceGrid.displayName = "WorkspaceGrid";
