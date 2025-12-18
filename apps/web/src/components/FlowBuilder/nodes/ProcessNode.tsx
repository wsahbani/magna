import { Box } from 'lucide-react'
import { createNode, defineNodeConfig, COLOR_SCHEMES, HANDLE_CONFIGS } from './BaseNode'
import { NodeToolbar } from './NodeToolbar'

/**
 * Process Node - Represents a sub-process or linked process
 * BPMN 2.0 compliant sub-process representation
 */
export const ProcessNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    ...COLOR_SCHEMES.simple,
    borderWidth: 1,
    icon: <Box className="w-5 h-5" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    handles: [
      HANDLE_CONFIGS.targetTop,
      HANDLE_CONFIGS.sourceBottom,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-2 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      
      // Build inline styles from data.style
      const inlineStyle: any = {
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }
      
      if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
      if (data?.style?.color) inlineStyle.color = data.style.color
      if (data?.style?.fontFamily) inlineStyle.fontFamily = data.style.fontFamily
      if (data?.style?.fontSize) {
        const fontSizeStr = String(data.style.fontSize)
        inlineStyle.fontSize = fontSizeStr.includes('px') ? fontSizeStr : `${fontSizeStr}px`
      }
      if (data?.style?.borderColor) {
        inlineStyle.borderColor = data.style.borderColor
        inlineStyle.borderStyle = data.style.borderStyle || 'solid'
      }
      if (data?.style?.borderStyle) inlineStyle.borderStyle = data.style.borderStyle
      if (data?.style?.borderWidth) {
        const borderWidthStr = String(data.style.borderWidth)
        inlineStyle.borderWidth = borderWidthStr.includes('px') ? borderWidthStr : `${borderWidthStr}px`
      }
      
      return (
        <div 
          className="relative w-full h-full"
          style={{
            width: inlineStyle.width,
            height: inlineStyle.height,
          }}
        >
          <NodeToolbar
            nodeId={id}
            selected={selected}
            parentId={data?.parentId}
            availableContainers={data?.availableContainers}
            onAttach={data?.onAttach}
            onDetach={data?.onDetach}
            isContainer={data?.isContainer}
            onNodeUpdate={data?.onNodeUpdate}
            currentStyle={data?.currentStyle}
            currentHandlePositions={data?.currentHandlePositions}
          />
          <div
            className={`relative rounded-lg px-5 py-4 min-w-[140px] min-h-[80px] flex items-center justify-center w-full h-full ${selectedClass} transition-all`}
            style={{
              backgroundColor: inlineStyle.backgroundColor || 'white',
              borderWidth: inlineStyle.borderWidth || '1px',
              borderColor: inlineStyle.borderColor || '#000000',
              borderStyle: inlineStyle.borderStyle || 'solid',
              fontFamily: inlineStyle.fontFamily || undefined,
              fontSize: inlineStyle.fontSize || undefined,
              color: inlineStyle.color || undefined,
            }}
          >
            {renderHandles()}
            <div className="flex flex-row items-center justify-start gap-3 w-full">
              {renderIcon()}
              <div className="flex-1 min-w-0">
                {renderLabel()}
              </div>
            </div>
          </div>
        </div>
      )
    },
  })
)

ProcessNode.displayName = 'ProcessNode'
