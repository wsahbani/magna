import { Node, Edge } from '@xyflow/react'
import { Heading1, Body, BodySmall, Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui'
import { Label } from '@repo/ui'
import { Input } from '@repo/ui'
import { Textarea } from '@repo/ui'
import { AlertCircle, Type, Palette, AlignCenter, AlignLeft, AlignRight, Plus, Minus, Link2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ProcessLinkSelector } from './ProcessLinkSelector'

// Simple Separator component
const Separator = () => <div className="border-t border-gray-200 my-3" />

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
          Sélectionnez un élément pour voir et modifier ses propriétés
        </Body>
      </div>
    )
  }

  if (selectedNode) {
    // Helper to safely access style properties with defaults
    // Use selectedNode directly to get latest style values
    const currentStyle: Record<string, any> = (selectedNode.data?.style as Record<string, any>) || {}
    
    // Check if node is a process type (mainProcess, supportProcess, managementProcess)
    const isProcessNode = ['mainProcess', 'supportProcess', 'managementProcess', 'process'].includes(
      selectedNode.type || ''
    )
    
    return (
      <div className="p-4 overflow-auto h-full bg-white">
        <Heading1 className="text-base font-semibold mb-4 text-gray-900">Propriétés</Heading1>

        {/* Tabs for process nodes */}
        {isProcessNode ? (
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="properties" className="text-xs">
                Propriétés
              </TabsTrigger>
              <TabsTrigger value="link" className="text-xs">
                <Link2 className="w-3 h-3 mr-1" />
                Liaison
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="mt-0">
              <div className="space-y-4">
          {/* Label */}
          <div>
            <Label htmlFor="node-label" className="text-xs font-medium text-gray-600 mb-1.5 block">
              Titre
            </Label>
            <Input
              id="node-label"
              value={localLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Saisir le titre..."
              className="w-full text-sm py-1.5"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="node-description" className="text-xs font-medium text-gray-600 mb-1.5 block">
              Description
            </Label>
            <Textarea
              id="node-description"
              value={localDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Saisir la description..."
              rows={2}
              className="w-full text-sm py-1.5"
            />
          </div>

          <Separator />

          {/* Colors Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Palette className="w-3.5 h-3.5" />
              <span>Couleurs</span>
            </div>

            {/* Background Color */}
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Arrière-plan
              </Label>
              <div className="grid grid-cols-8 gap-1.5">
                {COLOR_PRESETS.slice(0, 8).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, backgroundColor: color.value }
                    })}
                    className={`h-7 rounded border transition-all hover:scale-110 ${
                      currentStyle?.backgroundColor === color.value
                        ? 'border-orange-500 ring-1 ring-orange-300 shadow-sm'
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
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Bordure
              </Label>
              <div className="grid grid-cols-8 gap-1.5">
                {COLOR_PRESETS.filter(c => !c.name.includes('Light')).slice(0, 8).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderColor: color.value }
                    })}
                    className={`h-7 rounded border-2 transition-all hover:scale-110 ${
                      currentStyle?.borderColor === color.value
                        ? 'ring-1 ring-orange-500 shadow-sm'
                        : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    style={{ borderColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Texte
              </Label>
              <div className="grid grid-cols-8 gap-1.5">
                {COLOR_PRESETS.filter(c => !c.name.includes('Light')).slice(0, 8).map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, color: color.value }
                    })}
                    className={`h-7 rounded border transition-all hover:scale-110 flex items-center justify-center text-xs font-bold ${
                      currentStyle?.color === color.value
                        ? 'border-orange-500 ring-1 ring-orange-300 shadow-sm'
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
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Type className="w-3.5 h-3.5" />
              <span>Paramètres de texte</span>
            </div>

            {/* Text Size */}
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Taille du texte
              </Label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const currentSize = parseInt(String(currentStyle?.fontSize || '14'))
                    const newSize = Math.max(10, currentSize - 2)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, fontSize: `${newSize}px` }
                    })
                  }}
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="flex-1 text-center py-1.5 px-2 border border-gray-300 rounded bg-gray-50 text-xs">
                  <span className="font-medium">
                    {currentStyle?.fontSize ? String(currentStyle.fontSize).replace('px', '') : '14'}px
                  </span>
                </div>
                <button
                  onClick={() => {
                    const fontSizeStr = String(currentStyle?.fontSize || '14px')
                    const currentSize = parseInt(fontSizeStr.replace('px', ''))
                    const newSize = Math.min(32, currentSize + 2)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, fontSize: `${newSize}px` }
                    })
                  }}
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Text Style */}
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Style de texte
              </Label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, fontWeight: 'normal' }
                  })}
                  className={`py-1.5 px-2 text-xs border rounded transition-all ${
                    (currentStyle?.fontWeight === 'normal' || !currentStyle?.fontWeight)
                      ? 'bg-orange-100 border-orange-500 text-orange-700 font-medium'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, fontWeight: 'bold' }
                  })}
                  className={`py-1.5 px-2 text-xs border rounded font-bold transition-all ${
                    currentStyle?.fontWeight === 'bold'
                      ? 'bg-orange-100 border-orange-500 text-orange-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Gras
                </button>
              </div>
            </div>

            {/* Text Align */}
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Alignement du texte
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, textAlign: 'left' }
                  })}
                  className={`py-1.5 px-2 border rounded flex items-center justify-center transition-all ${
                    currentStyle?.textAlign === 'left' 
                      ? 'bg-orange-100 border-orange-500 text-orange-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, textAlign: 'center' }
                  })}
                  className={`py-1.5 px-2 border rounded flex items-center justify-center transition-all ${
                    (currentStyle?.textAlign === 'center' || !currentStyle?.textAlign)
                      ? 'bg-orange-100 border-orange-500 text-orange-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNodeUpdate(selectedNode.id, { 
                    style: { ...currentStyle, textAlign: 'right' }
                  })}
                  className={`py-1.5 px-2 border rounded flex items-center justify-center transition-all ${
                    currentStyle?.textAlign === 'right' 
                      ? 'bg-orange-100 border-orange-500 text-orange-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shape Settings */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-gray-700">
              Paramètres de forme
            </div>

            {/* Border Width */}
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Épaisseur de la bordure
              </Label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const borderWidthStr = String(currentStyle?.borderWidth || '2')
                    const currentWidth = parseInt(borderWidthStr.replace('px', ''))
                    const newWidth = Math.max(0, currentWidth - 1)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderWidth: `${newWidth}px` }
                    })
                  }}
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="flex-1 text-center py-1.5 px-2 border border-gray-300 rounded bg-gray-50 text-xs">
                  <span className="font-medium">
                    {currentStyle?.borderWidth ? String(currentStyle.borderWidth).replace('px', '') : '2'}px
                  </span>
                </div>
                <button
                  onClick={() => {
                    const borderWidthStr = String(currentStyle?.borderWidth || '2px')
                    const currentWidth = parseInt(borderWidthStr.replace('px', ''))
                    const newWidth = Math.min(10, currentWidth + 1)
                    onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderWidth: `${newWidth}px` }
                    })
                  }}
                  className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Corner Roundness */}
            <div>
              <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Arrondi des coins
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 4, 8, 16].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, borderRadius: radius }
                    })}
                    className={`h-8 border transition-all hover:scale-105 ${
                      (currentStyle?.borderRadius === radius || 
                       (!currentStyle?.borderRadius && radius === 8))
                        ? 'bg-orange-100 border-orange-500 shadow-sm'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{ borderRadius: `${radius}px` }}
                  >
                    <div className="text-[10px] font-medium">{radius === 0 ? 'Carré' : radius === 4 ? 'Léger' : radius === 8 ? 'Normal' : 'Rond'}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
              </div>
            </TabsContent>
            
            <TabsContent value="link" className="mt-0">
              <ProcessLinkSelector
                selectedProcessId={selectedNode.data?.linkedProcessId}
                selectedProcessType={selectedNode.data?.linkedProcessType}
                onSelect={(item) => {
                  onNodeUpdate(selectedNode.id, {
                    linkedProcessId: item.id,
                    linkedProcessType: item.type,
                    linkedProcessTitle: item.title,
                    linkedProcessCode: item.code,
                    linkedProcessFlowType: item.flowType,
                  })
                }}
                onClear={() => {
                  onNodeUpdate(selectedNode.id, {
                    linkedProcessId: undefined,
                    linkedProcessType: undefined,
                    linkedProcessTitle: undefined,
                    linkedProcessCode: undefined,
                    linkedProcessFlowType: undefined,
                  })
                }}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            {/* Label */}
            <div>
              <Label htmlFor="node-label" className="text-xs font-medium text-gray-600 mb-1.5 block">
                Titre
              </Label>
              <Input
                id="node-label"
                value={localLabel}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Saisir le titre..."
                className="w-full text-sm py-1.5"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="node-description" className="text-xs font-medium text-gray-600 mb-1.5 block">
                Description
              </Label>
              <Textarea
                id="node-description"
                value={localDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Saisir la description..."
                rows={2}
                className="w-full text-sm py-1.5"
              />
            </div>

            <Separator />

            {/* Colors Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Palette className="w-3.5 h-3.5" />
                <span>Couleurs</span>
              </div>

              {/* Background Color */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Arrière-plan
                </Label>
                <div className="grid grid-cols-8 gap-1.5">
                  {COLOR_PRESETS.slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, backgroundColor: color.value }
                      })}
                      className={`h-7 rounded border transition-all hover:scale-110 ${
                        currentStyle?.backgroundColor === color.value
                          ? 'border-orange-500 ring-1 ring-orange-300 shadow-sm'
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
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Bordure
                </Label>
                <div className="grid grid-cols-8 gap-1.5">
                  {COLOR_PRESETS.filter(c => !c.name.includes('Light')).slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, borderColor: color.value }
                      })}
                      className={`h-7 rounded border-2 transition-all hover:scale-110 ${
                        currentStyle?.borderColor === color.value
                          ? 'ring-1 ring-orange-500 shadow-sm'
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                      style={{ borderColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Texte
                </Label>
                <div className="grid grid-cols-8 gap-1.5">
                  {COLOR_PRESETS.filter(c => !c.name.includes('Light')).slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, color: color.value }
                      })}
                      className={`h-7 rounded border transition-all hover:scale-110 flex items-center justify-center text-xs font-bold ${
                        currentStyle?.color === color.value
                          ? 'border-orange-500 ring-1 ring-orange-300 shadow-sm'
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
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Type className="w-3.5 h-3.5" />
                <span>Paramètres de texte</span>
              </div>

              {/* Text Size */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Taille du texte
                </Label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const currentSize = parseInt(String(currentStyle?.fontSize || '14'))
                      const newSize = Math.max(10, currentSize - 2)
                      onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, fontSize: `${newSize}px` }
                      })
                    }}
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex-1 text-center py-1.5 px-2 border border-gray-300 rounded bg-gray-50 text-xs">
                    <span className="font-medium">
                      {currentStyle?.fontSize ? String(currentStyle.fontSize).replace('px', '') : '14'}px
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const fontSizeStr = String(currentStyle?.fontSize || '14px')
                      const currentSize = parseInt(fontSizeStr.replace('px', ''))
                      const newSize = Math.min(32, currentSize + 2)
                      onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, fontSize: `${newSize}px` }
                      })
                    }}
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Text Style */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Style de texte
                </Label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, fontWeight: 'normal' }
                    })}
                    className={`py-1.5 px-2 text-xs border rounded transition-all ${
                      (currentStyle?.fontWeight === 'normal' || !currentStyle?.fontWeight)
                        ? 'bg-orange-100 border-orange-500 text-orange-700 font-medium'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, fontWeight: 'bold' }
                    })}
                    className={`py-1.5 px-2 text-xs border rounded font-bold transition-all ${
                      currentStyle?.fontWeight === 'bold'
                        ? 'bg-orange-100 border-orange-500 text-orange-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Gras
                  </button>
                </div>
              </div>

              {/* Text Align */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Alignement du texte
                </Label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, textAlign: 'left' }
                    })}
                    className={`py-1.5 px-2 border rounded flex items-center justify-center transition-all ${
                      currentStyle?.textAlign === 'left' 
                        ? 'bg-orange-100 border-orange-500 text-orange-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, textAlign: 'center' }
                    })}
                    className={`py-1.5 px-2 border rounded flex items-center justify-center transition-all ${
                      (currentStyle?.textAlign === 'center' || !currentStyle?.textAlign)
                        ? 'bg-orange-100 border-orange-500 text-orange-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNodeUpdate(selectedNode.id, { 
                      style: { ...currentStyle, textAlign: 'right' }
                    })}
                    className={`py-1.5 px-2 border rounded flex items-center justify-center transition-all ${
                      currentStyle?.textAlign === 'right' 
                        ? 'bg-orange-100 border-orange-500 text-orange-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Shape Settings */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-700">
                Paramètres de forme
              </div>

              {/* Border Width */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Épaisseur de la bordure
                </Label>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const borderWidthStr = String(currentStyle?.borderWidth || '2')
                      const currentWidth = parseInt(borderWidthStr.replace('px', ''))
                      const newWidth = Math.max(0, currentWidth - 1)
                      onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, borderWidth: `${newWidth}px` }
                      })
                    }}
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex-1 text-center py-1.5 px-2 border border-gray-300 rounded bg-gray-50 text-xs">
                    <span className="font-medium">
                      {currentStyle?.borderWidth ? String(currentStyle.borderWidth).replace('px', '') : '2'}px
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const borderWidthStr = String(currentStyle?.borderWidth || '2px')
                      const currentWidth = parseInt(borderWidthStr.replace('px', ''))
                      const newWidth = Math.min(10, currentWidth + 1)
                      onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, borderWidth: `${newWidth}px` }
                      })
                    }}
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Corner Roundness */}
              <div>
                <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Arrondi des coins
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 4, 8, 16].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => onNodeUpdate(selectedNode.id, { 
                        style: { ...currentStyle, borderRadius: radius }
                      })}
                      className={`h-8 border transition-all hover:scale-105 ${
                        (currentStyle?.borderRadius === radius || 
                         (!currentStyle?.borderRadius && radius === 8))
                          ? 'bg-orange-100 border-orange-500 shadow-sm'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      style={{ borderRadius: `${radius}px` }}
                    >
                      <div className="text-[10px] font-medium">{radius === 0 ? 'Carré' : radius === 4 ? 'Léger' : radius === 8 ? 'Normal' : 'Rond'}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (selectedEdge) {
    return (
      <div className="p-4 overflow-auto h-full bg-white">
        <Heading1 className="text-base font-semibold mb-4 text-gray-900">Propriétés de connexion</Heading1>

        <div className="space-y-3">
          {/* Edge Type */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Type
            </Label>
            <BodySmall className="text-gray-700 capitalize">
              {selectedEdge.type || 'par défaut'}
            </BodySmall>
          </div>

          {/* Label */}
          <div>
            <Label htmlFor="edge-label" className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
              Libellé
            </Label>
            <Input
              id="edge-label"
              value={localEdgeLabel}
              onChange={(e) => handleEdgeLabelChange(e.target.value)}
              placeholder="Saisir le libellé..."
              className="w-full text-sm py-1.5"
            />
          </div>

          {/* Condition */}
          <div>
            <Label htmlFor="edge-condition" className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
              Condition
            </Label>
            <Textarea
              id="edge-condition"
              value={localEdgeCondition}
              onChange={(e) => handleEdgeConditionChange(e.target.value)}
              placeholder="Saisir l'expression de condition..."
              rows={2}
              className="w-full text-sm py-1.5"
            />
          </div>

          {/* Connection Info */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Connexion
            </Label>
            <div className="space-y-1">
              <BodySmall className="text-gray-500">
                De : <span className="text-gray-700 font-mono text-xs">{selectedEdge.source}</span>
              </BodySmall>
              <BodySmall className="text-gray-500">
                Vers : <span className="text-gray-700 font-mono text-xs">{selectedEdge.target}</span>
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
