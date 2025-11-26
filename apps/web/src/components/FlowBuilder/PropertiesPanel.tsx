import { Node, Edge } from '@xyflow/react'
import { Heading1, Body, BodySmall } from '@repo/ui'
import { Label } from '@repo/ui'
import { Input } from '@repo/ui'
import { Textarea } from '@repo/ui'
import { AlertCircle, Type, Palette, AlignCenter, AlignLeft, AlignRight, Plus, Minus } from 'lucide-react'
import { useState, useEffect } from 'react'

// Simple Separator component
const Separator = () => <div className="border-t border-gray-200 my-4" />

// Preset color options for non-technical users
const COLOR_PRESETS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#f3f4f6' },
  { name: 'Gray', value: '#9ca3af' },
  { name: 'Dark', value: '#1f2937' },
  { name: 'Orange', value: '#ff6600' },
  { name: 'Light Orange', value: '#ffedd5' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Light Blue', value: '#dbeafe' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Light Green', value: '#dcfce7' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Light Red', value: '#fee2e2' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Light Yellow', value: '#fef9c3' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Light Purple', value: '#f3e8ff' },
]

interface PropertiesPanelProps {
  selectedNode: Node | null
  selectedEdge: Edge | null
  onNodeUpdate: (nodeId: string, data: Partial<Node['data']>) => void
  onEdgeUpdate: (edgeId: string, data: Partial<Edge>) => void
}

export function PropertiesPanel({
  selectedNode,
  selectedEdge,
  onNodeUpdate,
  onEdgeUpdate,
}: PropertiesPanelProps) {
  const hasSelection = selectedNode || selectedEdge
  
  // Local state for text inputs to prevent losing focus
  const [localLabel, setLocalLabel] = useState('')
  const [localDescription, setLocalDescription] = useState('')
  const [localEdgeLabel, setLocalEdgeLabel] = useState('')
  const [localEdgeCondition, setLocalEdgeCondition] = useState('')
  
  // Sync local state with selected node/edge
  useEffect(() => {
    if (selectedNode) {
      setLocalLabel((selectedNode.data?.label as string) || '')
      setLocalDescription((selectedNode.data?.description as string) || '')
    }
  }, [selectedNode?.id]) // Only reset when selection changes
  
  useEffect(() => {
    if (selectedEdge) {
      setLocalEdgeLabel((selectedEdge.label as string) || '')
      setLocalEdgeCondition((selectedEdge.data?.condition as string) || '')
    }
  }, [selectedEdge?.id]) // Only reset when selection changes
  
  // Handle text input changes with debouncing
  const handleLabelChange = (value: string) => {
    setLocalLabel(value)
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { label: value })
    }
  }
  
  const handleDescriptionChange = (value: string) => {
    setLocalDescription(value)
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { description: value })
    }
  }
  
  const handleEdgeLabelChange = (value: string) => {
    setLocalEdgeLabel(value)
    if (selectedEdge) {
      onEdgeUpdate(selectedEdge.id, { label: value })
    }
  }
  
  const handleEdgeConditionChange = (value: string) => {
    setLocalEdgeCondition(value)
    if (selectedEdge) {
      onEdgeUpdate(selectedEdge.id, { data: { ...selectedEdge.data, condition: value } })
    }
  }

  if (!hasSelection) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <Body className="text-gray-500">
          Select an element to view and edit its properties
        </Body>
      </div>
    )
  }

  if (selectedNode) {
    // Helper to safely access style properties with defaults
    const currentStyle: Record<string, any> = selectedNode.data?.style || {}
    
    return (
      <div className="p-6 overflow-auto h-full">
        <Heading1 className="text-lg mb-6">Properties</Heading1>

        <div className="space-y-6">
          {/* Label */}
          <div>
            <Label htmlFor="node-label" className="text-sm font-medium text-gray-700 mb-2 block">
              Title
            </Label>
            <Input
              id="node-label"
              value={localLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Enter title..."
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="node-description" className="text-sm font-medium text-gray-700 mb-2 block">
              Description
            </Label>
            <Textarea
              id="node-description"
              value={localDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter description..."
              rows={3}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Colors Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Palette className="w-4 h-4" />
              <span>Colors</span>
            </div>

            {/* Background Color */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Background
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.slice(0, 8).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, backgroundColor: color.value }
                    })}
                    className={`h-10 rounded border-2 transition-all ${
                      currentStyle?.backgroundColor === color.value
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Border Color */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Border
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.filter(c => !c.name.includes('Light')).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderColor: color.value }
                    })}
                    className={`h-10 rounded border-4 transition-all ${
                      currentStyle?.borderColor === color.value
                        ? 'ring-2 ring-orange-500'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    style={{ borderColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Text
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.filter(c => !c.name.includes('Light')).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, color: color.value }
                    })}
                    className={`h-10 rounded border-2 flex items-center justify-center font-bold transition-all ${
                      currentStyle?.color === color.value
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ color: color.value }}
                    title={color.name}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Type className="w-4 h-4" />
              <span>Text Settings</span>
            </div>

            {/* Text Size */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Text Size
              </Label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const currentSize = parseInt(currentStyle?.fontSize || '14')
                    const newSize = Math.max(10, currentSize - 2)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, fontSize: newSize.toString() }
                    })
                  }}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center py-2 px-3 border border-gray-300 rounded bg-gray-50">
                  <span className="font-medium">{currentStyle?.fontSize || '14'}px</span>
                </div>
                <button
                  onClick={() => {
                    const currentSize = parseInt(currentStyle?.fontSize || '14')
                    const newSize = Math.min(32, currentSize + 2)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, fontSize: newSize.toString() }
                    })
                  }}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Text Style */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Text Style
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, fontWeight: 'normal' }
                  })}
                  className={`py-2 px-3 border rounded transition-all ${
                    (currentStyle?.fontWeight === 'normal' || !currentStyle?.fontWeight)
                      ? 'bg-orange-100 border-orange-500 text-orange-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, fontWeight: 'bold' }
                  })}
                  className={`py-2 px-3 border rounded font-bold transition-all ${
                    currentStyle?.fontWeight === 'bold'
                      ? 'bg-orange-100 border-orange-500 text-orange-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Bold
                </button>
              </div>
            </div>

            {/* Text Align */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Text Align
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, textAlign: 'left' }
                  })}
                  className={`py-2 px-3 border rounded flex items-center justify-center transition-all ${
                    currentStyle?.textAlign === 'left' 
                      ? 'bg-orange-100 border-orange-500 text-orange-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, textAlign: 'center' }
                  })}
                  className={`py-2 px-3 border rounded flex items-center justify-center transition-all ${
                    (currentStyle?.textAlign === 'center' || !currentStyle?.textAlign)
                      ? 'bg-orange-100 border-orange-500 text-orange-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, textAlign: 'right' }
                  })}
                  className={`py-2 px-3 border rounded flex items-center justify-center transition-all ${
                    currentStyle?.textAlign === 'right' 
                      ? 'bg-orange-100 border-orange-500 text-orange-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shape Settings */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-700">
              Shape Settings
            </div>

            {/* Border Width */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Border Thickness
              </Label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const currentWidth = parseInt(currentStyle?.borderWidth?.toString() || '2')
                    const newWidth = Math.max(0, currentWidth - 1)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderWidth: newWidth }
                    })
                  }}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center py-2 px-3 border border-gray-300 rounded bg-gray-50">
                  <span className="font-medium">{currentStyle?.borderWidth || 2}px</span>
                </div>
                <button
                  onClick={() => {
                    const currentWidth = parseInt(currentStyle?.borderWidth?.toString() || '2')
                    const newWidth = Math.min(10, currentWidth + 1)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderWidth: newWidth }
                    })
                  }}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Corner Roundness */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Corner Roundness
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 4, 8, 16].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderRadius: radius }
                    })}
                    className={`h-12 border-2 transition-all ${
                      (currentStyle?.borderRadius === radius || 
                       (!currentStyle?.borderRadius && radius === 8))
                        ? 'bg-orange-100 border-orange-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{ borderRadius: `${radius}px` }}
                  >
                    <div className="text-xs">{radius === 0 ? 'Square' : radius === 4 ? 'Slight' : radius === 8 ? 'Normal' : 'Round'}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedEdge) {
    return (
      <div className="p-6">
        <Heading1 className="text-lg mb-6">Connection Properties</Heading1>

        <div className="space-y-4">
          {/* Edge Type */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Type
            </Label>
            <BodySmall className="text-gray-700 capitalize">
              {selectedEdge.type || 'default'}
            </BodySmall>
          </div>

          {/* Label */}
          <div>
            <Label htmlFor="edge-label" className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Label
            </Label>
            <Input
              id="edge-label"
              value={localEdgeLabel}
              onChange={(e) => handleEdgeLabelChange(e.target.value)}
              placeholder="Enter label..."
              className="w-full"
            />
          </div>

          {/* Condition */}
          <div>
            <Label htmlFor="edge-condition" className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Condition
            </Label>
            <Textarea
              id="edge-condition"
              value={localEdgeCondition}
              onChange={(e) => handleEdgeConditionChange(e.target.value)}
              placeholder="Enter condition expression..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Connection Info */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Connection
            </Label>
            <div className="space-y-1">
              <BodySmall className="text-gray-500">
                From: <span className="text-gray-700 font-mono text-xs">{selectedEdge.source}</span>
              </BodySmall>
              <BodySmall className="text-gray-500">
                To: <span className="text-gray-700 font-mono text-xs">{selectedEdge.target}</span>
              </BodySmall>
            </div>
          </div>

          {/* Edge ID (read-only) */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase mb-2">
              ID
            </Label>
            <BodySmall className="text-gray-400 font-mono text-xs">
              {selectedEdge.id}
            </BodySmall>
          </div>
        </div>
      </div>
    )
  }

  return null
}
