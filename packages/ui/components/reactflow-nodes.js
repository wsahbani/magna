import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Handle, Position } from "reactflow";
import { cn } from "../lib/utils";
export var ProcessNode = React.memo(function (_a) {
    var data = _a.data, selected = _a.selected;
    var nodeStyle = {
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: data.borderColor || '#e2e8f0',
        color: data.fontColor || '#1a202c',
    };
    return (_jsxs("div", { className: cn("process-node min-w-[120px] min-h-[80px] px-3 py-2 border-2 rounded-lg shadow-sm", "transition-all duration-200 hover:shadow-md", selected && "process-node selected", data.isError && "process-node error", "focus:outline-none focus:ring-2 focus:ring-primary/50"), style: nodeStyle, children: [_jsx(Handle, { type: "target", position: Position.Left, className: "w-3 h-3 !bg-primary border-2 border-white", isConnectable: data.isConnectable }), _jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [data.icon && (_jsx("div", { className: "mb-1", children: _jsx("span", { className: "text-lg", children: data.icon }) })), _jsx("div", { className: "text-xs font-medium leading-tight", children: data.label }), data.description && (_jsx("div", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: data.description }))] }), _jsx(Handle, { type: "source", position: Position.Right, className: "w-3 h-3 !bg-primary border-2 border-white", isConnectable: data.isConnectable })] }));
});
ProcessNode.displayName = "ProcessNode";
export var StartEventNode = React.memo(function (_a) {
    var data = _a.data, selected = _a.selected;
    return (_jsxs("div", { className: cn("w-12 h-12 rounded-full border-4 border-green-500 bg-green-50", "flex items-center justify-center shadow-sm", "transition-all duration-200 hover:shadow-md hover:scale-105", selected && "ring-2 ring-primary/50"), children: [_jsx(Handle, { type: "source", position: Position.Right, className: "w-3 h-3 !bg-green-500 border-2 border-white", isConnectable: data.isConnectable }), _jsx("div", { className: "text-green-600 text-lg", children: data.icon || "▶" })] }));
});
StartEventNode.displayName = "StartEventNode";
export var EndEventNode = React.memo(function (_a) {
    var data = _a.data, selected = _a.selected;
    return (_jsxs("div", { className: cn("w-12 h-12 rounded-full border-4 border-red-500 bg-red-50", "flex items-center justify-center shadow-sm", "transition-all duration-200 hover:shadow-md hover:scale-105", selected && "ring-2 ring-primary/50"), children: [_jsx(Handle, { type: "target", position: Position.Left, className: "w-3 h-3 !bg-red-500 border-2 border-white", isConnectable: data.isConnectable }), _jsx("div", { className: "text-red-600 text-lg", children: data.icon || "⏹" })] }));
});
EndEventNode.displayName = "EndEventNode";
export var GatewayNode = React.memo(function (_a) {
    var data = _a.data, selected = _a.selected;
    return (_jsxs("div", { className: cn("w-12 h-12 border-4 border-orange-500 bg-orange-50", "flex items-center justify-center shadow-sm", "transition-all duration-200 hover:shadow-md hover:scale-105", "transform rotate-45", selected && "ring-2 ring-primary/50"), children: [_jsx(Handle, { type: "target", position: Position.Left, className: "w-3 h-3 !bg-orange-500 border-2 border-white -translate-x-2", isConnectable: data.isConnectable }), _jsx(Handle, { type: "source", position: Position.Right, className: "w-3 h-3 !bg-orange-500 border-2 border-white translate-x-2", isConnectable: data.isConnectable }), _jsx(Handle, { type: "source", position: Position.Top, className: "w-3 h-3 !bg-orange-500 border-2 border-white -translate-y-2", isConnectable: data.isConnectable }), _jsx(Handle, { type: "source", position: Position.Bottom, className: "w-3 h-3 !bg-orange-500 border-2 border-white translate-y-2", isConnectable: data.isConnectable }), _jsx("div", { className: "text-orange-600 text-sm transform -rotate-45", children: data.icon || "?" })] }));
});
GatewayNode.displayName = "GatewayNode";
// Node type registry for ReactFlow
export var nodeTypes = {
    processNode: ProcessNode,
    startEvent: StartEventNode,
    endEvent: EndEventNode,
    gateway: GatewayNode,
};
