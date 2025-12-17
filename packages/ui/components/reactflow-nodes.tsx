import * as React from "react"
import { Handle, Position } from "reactflow"
import { cn } from "../lib/utils"

export interface ReactFlowNodeProps {
  id: string
  data: {
    label: string
    description?: string
    type: string
    icon?: string
    backgroundColor?: string
    borderColor?: string
    fontColor?: string
    isSelected?: boolean
    isError?: boolean
    isConnectable?: boolean
  }
  selected?: boolean
}

export const ProcessNode = React.memo<ReactFlowNodeProps>(({ 
  data, 
  selected 
}) => {
  const nodeStyle = {
    backgroundColor: data.backgroundColor || '#ffffff',
    borderColor: data.borderColor || '#e2e8f0',
    color: data.fontColor || '#1a202c',
  }

  return (
    <div
      className={cn(
        "process-node min-w-[120px] min-h-[80px] px-3 py-2 border-2 rounded-lg shadow-sm",
        "transition-all duration-200 hover:shadow-md",
        selected && "process-node selected",
        data.isError && "process-node error",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
      style={nodeStyle}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-primary border-2 border-white"
        isConnectable={data.isConnectable}
      />
      
      <div className="flex flex-col items-center justify-center h-full text-center">
        {data.icon && (
          <div className="mb-1">
            <span className="text-lg">{data.icon}</span>
          </div>
        )}
        <div className="text-xs font-medium leading-tight">
          {data.label}
        </div>
        {data.description && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {data.description}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-primary border-2 border-white"
        isConnectable={data.isConnectable}
      />
    </div>
  )
})
ProcessNode.displayName = "ProcessNode"

export const StartEventNode = React.memo<ReactFlowNodeProps>(({ 
  data, 
  selected 
}) => {
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-full border-4 border-green-500 bg-green-50",
        "flex items-center justify-center shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:scale-105",
        selected && "ring-2 ring-primary/50"
      )}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-500 border-2 border-white"
        isConnectable={data.isConnectable}
      />
      
      <div className="text-green-600 text-lg">
        {data.icon || "▶"}
      </div>
    </div>
  )
})
StartEventNode.displayName = "StartEventNode"

export const EndEventNode = React.memo<ReactFlowNodeProps>(({ 
  data, 
  selected 
}) => {
  return (
    <div
      className={cn(
        "w-12 h-12 rounded-full border-4 border-red-500 bg-red-50",
        "flex items-center justify-center shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:scale-105",
        selected && "ring-2 ring-primary/50"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-red-500 border-2 border-white"
        isConnectable={data.isConnectable}
      />
      
      <div className="text-red-600 text-lg">
        {data.icon || "⏹"}
      </div>
    </div>
  )
})
EndEventNode.displayName = "EndEventNode"

export const GatewayNode = React.memo<ReactFlowNodeProps>(({ 
  data, 
  selected 
}) => {
  return (
    <div
      className={cn(
        "w-12 h-12 border-4 border-orange-500 bg-orange-50",
        "flex items-center justify-center shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:scale-105",
        "transform rotate-45",
        selected && "ring-2 ring-primary/50"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-orange-500 border-2 border-white -translate-x-2"
        isConnectable={data.isConnectable}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-orange-500 border-2 border-white translate-x-2"
        isConnectable={data.isConnectable}
      />
      
      <Handle
        type="source"
        position={Position.Top}
        className="w-3 h-3 !bg-orange-500 border-2 border-white -translate-y-2"
        isConnectable={data.isConnectable}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-orange-500 border-2 border-white translate-y-2"
        isConnectable={data.isConnectable}
      />
      
      <div className="text-orange-600 text-sm transform -rotate-45">
        {data.icon || "?"}
      </div>
    </div>
  )
})
GatewayNode.displayName = "GatewayNode"

// Node type registry for ReactFlow
export const nodeTypes = {
  processNode: ProcessNode,
  startEvent: StartEventNode,
  endEvent: EndEventNode,
  gateway: GatewayNode,
}