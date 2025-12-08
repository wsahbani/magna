/**
 * Text Node - Simple text/title node for flow diagrams
 * Used to add titles, labels, or annotations to the flow
 */

import { Type } from 'lucide-react'
import { createNode, defineNodeConfig } from './BaseNode'

export const TextNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'transparent',
    borderColor: 'border-transparent',
    borderWidth: 0,
    icon: <Type className="w-4 h-4 text-gray-500" />,
    resizable: true,
    minWidth: 80,
    minHeight: 30,
    maxWidth: 500,
    maxHeight: 200,
    handles: [], // No handles - text nodes don't connect to other nodes
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderLabel, width, height }) => {
      const selectedClass = selected ? 'ring-2 ring-orange-400 ring-opacity-50' : ''
      
      // Get text styling from data.style
      const nodeStyle = (data?.style as Record<string, any>) || {}
      
      const inlineStyle: any = {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        backgroundColor: nodeStyle.backgroundColor || 'transparent',
        color: nodeStyle.color || '#374151',
        fontSize: nodeStyle.fontSize || '16px',
        fontWeight: nodeStyle.fontWeight || '600',
        textAlign: (nodeStyle.textAlign || 'center') as any,
        borderColor: nodeStyle.borderColor || 'transparent',
        borderWidth: nodeStyle.borderWidth || '0px',
        borderRadius: nodeStyle.borderRadius || '0px',
      }
      
      return (
        <div
          className={`flex items-center justify-center w-full h-full px-2 py-1 ${selectedClass} transition-all`}
          style={inlineStyle}
        >
          {renderLabel()}
        </div>
      )
    },
  })
)

TextNode.displayName = 'TextNode'

