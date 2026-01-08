/**
 * Types de nœuds Qualigram pour ProcessMap (Niveau 1)
 * Implémente les types de nœuds de la méthodologie Qualigram
 */

import { memo } from 'react'
import type React from 'react'
import { Position, useNodes } from '@xyflow/react'
import { 
  Activity, 
  Settings, 
  Shield, 
  Users, 
  Building2,
  Globe,
  Link2,
  Plus,
  LayoutGrid,
  Link,
  Unlink,
  Palette,
  Type,
  Minus,
  Move,
  ArrowUpDown,
  ArrowLeftRight,
  Target,
  Sparkles
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { createNode, defineNodeConfig, HANDLE_CONFIGS, COLOR_SCHEMES } from './BaseNode'
import type { Node } from '@xyflow/react'

// Preset color options (same as PropertiesPanel)
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

// Font family options
const FONT_FAMILIES = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { name: 'Courier New', value: '"Courier New", Courier, monospace' },
]

// Border style options
const BORDER_STYLES = [
  { name: 'Solide', value: 'solid' },
  { name: 'Pointillé', value: 'dashed' },
  { name: 'Pointillés', value: 'dotted' },
]

/**
 * Composant barre d'outils pour nœuds sélectionnés
 * Contient les boutons attach/detach et les options de style
 */
const NodeToolbar = memo(({ 
  nodeId, 
  selected, 
  parentId, 
  availableContainers, 
  onAttach, 
  onDetach,
  isContainer,
  onNodeUpdate,
  currentStyle,
  currentHandlePositions,
  onCreateProcess,
  onGenerateLevel2Process,
  nodeType
}: { 
  nodeId: string
  selected: boolean
  parentId?: string
  availableContainers?: Array<{ id: string; data?: { label?: string; [key: string]: any } }>
  onAttach?: (nodeId: string, containerId: string) => void
  onDetach?: (nodeId: string) => void
  isContainer?: boolean
  onNodeUpdate?: (nodeId: string, data: Partial<Node['data']>) => void
  currentStyle?: Record<string, any>
  currentHandlePositions?: { source?: string; target?: string }
  onCreateProcess?: (nodeId: string, containerId: string) => void
  onGenerateLevel2Process?: (nodeId: string) => void
  nodeType?: string
}) => {
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [showStyleMenu, setShowStyleMenu] = useState(false)
  const [showHandleMenu, setShowHandleMenu] = useState(false)
  const attachMenuRef = useRef<HTMLDivElement>(null)
  const styleMenuRef = useRef<HTMLDivElement>(null)
  const handleMenuRef = useRef<HTMLDivElement>(null)

  const style = currentStyle || {}

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (attachMenuRef.current && !attachMenuRef.current.contains(target)) {
        setShowAttachMenu(false)
      }
      if (styleMenuRef.current && !styleMenuRef.current.contains(target)) {
        setShowStyleMenu(false)
      }
      if (handleMenuRef.current && !handleMenuRef.current.contains(target)) {
        setShowHandleMenu(false)
      }
    }

    if (showAttachMenu || showStyleMenu || showHandleMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showAttachMenu, showStyleMenu, showHandleMenu])

  // Ne pas afficher la barre d'outils sur les conteneurs ou si pas sélectionné
  if (!selected || isContainer) {
    return null
  }

  // Check if this is a mainProcess node
  const isMainProcess = nodeType === 'mainProcess'
  const showGenerateLevel2Button = isMainProcess && onGenerateLevel2Process

  const handleStyleUpdate = (styleUpdates: Record<string, any>) => {
    if (!onNodeUpdate) return
    const updatedStyle = { ...style, ...styleUpdates }
    onNodeUpdate(nodeId, { style: updatedStyle })
  }

  const handleHandlePositionUpdate = (source: string, target: string) => {
    if (!onNodeUpdate) return
    onNodeUpdate(nodeId, { handlePositions: { source, target } })
    setShowHandleMenu(false)
  }

  // Définir les présélections de positions des handles
  const handlePresets = [
    {
      id: 'left-right',
      name: 'Gauche-Droite',
      source: 'right',
      target: 'left',
      icon: ArrowLeftRight,
      description: 'Source à droite, Target à gauche'
    },
    {
      id: 'top-bottom',
      name: 'Haut-Bas',
      source: 'bottom',
      target: 'top',
      icon: ArrowUpDown,
      description: 'Source en bas, Target en haut'
    },
    {
      id: 'right-left',
      name: 'Droite-Gauche',
      source: 'left',
      target: 'right',
      icon: ArrowLeftRight,
      description: 'Source à gauche, Target à droite'
    },
    {
      id: 'bottom-top',
      name: 'Bas-Haut',
      source: 'top',
      target: 'bottom',
      icon: ArrowUpDown,
      description: 'Source en haut, Target en bas'
    },
  ]

  // Vérifier quelle présélection est actuellement active
  const getCurrentPreset = () => {
    const current = currentHandlePositions || {}
    return handlePresets.find(
      preset => preset.source === current.source && preset.target === current.target
    )?.id || 'left-right' // Par défaut
  }

  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-1 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1" onClick={(e) => e.stopPropagation()}>
      {/* Generate Level 2 Process Button (mainProcess only) */}
      {showGenerateLevel2Button && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onGenerateLevel2Process(nodeId)
          }}
          className="p-1.5 rounded hover:bg-purple-50 transition-colors bg-purple-500 text-white"
          title="Générer le processus niveau 2 avec IA"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      )}

      {/* Bouton attach/detach */}
      {parentId ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDetach?.(nodeId)
          }}
          className="bg-red-500 hover:bg-red-600 text-white rounded p-1.5 shadow-sm transition-colors"
          title="Détacher du groupe"
        >
          <Unlink className="w-4 h-4" />
        </button>
      ) : (
        <div className="relative" ref={attachMenuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowAttachMenu(!showAttachMenu)
              setShowStyleMenu(false)
            }}
            className="bg-green-500 hover:bg-green-600 text-white rounded p-1.5 shadow-sm transition-colors"
            title="Attacher à un groupe"
          >
            <Link className="w-4 h-4" />
          </button>
          {showAttachMenu && availableContainers && availableContainers.length > 0 && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[200px] max-h-[300px] overflow-y-auto">
              {availableContainers.map((container) => (
                <button
                  key={container.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onAttach?.(nodeId, container.id)
                    setShowAttachMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm transition-colors"
                >
                  {container.data?.label || container.id}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bouton Handle Position */}
      <div className="relative" ref={handleMenuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowHandleMenu(!showHandleMenu)
            setShowAttachMenu(false)
            setShowStyleMenu(false)
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded p-1.5 shadow-sm transition-colors"
          title="Changer position des handles"
        >
          <Move className="w-4 h-4" />
        </button>
        {showHandleMenu && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[200px] p-2">
            <div className="text-xs font-semibold text-gray-700 mb-2 px-1">Position des handles</div>
            <div className="space-y-1">
              {handlePresets.map((preset) => {
                const Icon = preset.icon
                const isActive = getCurrentPreset() === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleHandlePositionUpdate(preset.source, preset.target)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    title={preset.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{preset.name}</span>
                    {isActive && (
                      <span className="text-xs text-orange-600 font-medium">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bouton style */}
      <div className="relative" ref={styleMenuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowStyleMenu(!showStyleMenu)
            setShowAttachMenu(false)
            setShowHandleMenu(false)
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded p-1.5 shadow-sm transition-colors"
          title="Options de style"
        >
          <Palette className="w-4 h-4" />
        </button>
        {showStyleMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 w-64 max-h-[400px] overflow-y-auto p-3">
            <div className="space-y-3">
              {/* Couleur de fond */}
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  <span>Arrière-plan</span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {COLOR_PRESETS.slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStyleUpdate({ backgroundColor: color.value })
                      }}
                      className={`h-6 rounded border transition-all hover:scale-110 ${
                        style?.backgroundColor === color.value
                          ? 'border-orange-500 ring-1 ring-orange-300 shadow-sm'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Couleur du texte */}
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Type className="w-3 h-3" />
                  <span>Couleur du texte</span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {COLOR_PRESETS.filter(c => !c.name.includes('Light')).slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStyleUpdate({ color: color.value })
                      }}
                      className={`h-6 rounded border transition-all hover:scale-110 flex items-center justify-center text-xs font-bold ${
                        style?.color === color.value
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

              {/* Famille de police */}
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Famille de police</div>
                <select
                  value={style?.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleStyleUpdate({ fontFamily: e.target.value })
                  }}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  {FONT_FAMILIES.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taille de police */}
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Taille du texte</div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const currentSize = parseInt(String(style?.fontSize || '14'))
                      const newSize = Math.max(10, currentSize - 2)
                      handleStyleUpdate({ fontSize: `${newSize}px` })
                    }}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex-1 text-center py-1 px-2 border border-gray-300 rounded bg-gray-50 text-xs">
                    <span className="font-medium">
                      {style?.fontSize ? String(style.fontSize).replace('px', '') : '14'}px
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const fontSizeStr = String(style?.fontSize || '14px')
                      const currentSize = parseInt(fontSizeStr.replace('px', ''))
                      const newSize = Math.min(32, currentSize + 2)
                      handleStyleUpdate({ fontSize: `${newSize}px` })
                    }}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Couleur de bordure */}
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Couleur de bordure</div>
                <div className="grid grid-cols-8 gap-1">
                  {COLOR_PRESETS.filter(c => !c.name.includes('Light')).slice(0, 8).map((color) => (
                    <button
                      key={color.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStyleUpdate({ borderColor: color.value })
                      }}
                      className={`h-6 rounded border-2 transition-all hover:scale-110 ${
                        style?.borderColor === color.value
                          ? 'ring-1 ring-orange-500 shadow-sm'
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                      style={{ borderColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Style de bordure */}
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-2">Style de bordure</div>
                <select
                  value={style?.borderStyle || 'solid'}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleStyleUpdate({ borderStyle: e.target.value })
                  }}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  {BORDER_STYLES.map((borderStyle) => (
                    <option key={borderStyle.value} value={borderStyle.value}>
                      {borderStyle.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
NodeToolbar.displayName = 'NodeToolbar'

/**
 * Nœud Processus Principal - Rectangle arrondi
 * Processus opérationnels principaux
 */
export const MainProcessNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-purple-500',
    borderWidth: 2,
    icon: <Activity className="w-5 h-5 text-purple-600" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    isContainer: false,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
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
      
      return (
        <div className="relative w-full h-full" style={{ width: inlineStyle.width, height: inlineStyle.height }}>
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
            onCreateProcess={data?.onCreateProcess}
            onGenerateLevel2Process={data?.onGenerateLevel2Process}
            nodeType="mainProcess"
          />
          <div
            className={`relative rounded-lg px-5 py-4 min-w-[140px] min-h-[80px] flex items-center justify-center w-full h-full ${selectedClass} transition-all`}
            style={{
              backgroundColor: inlineStyle.backgroundColor || 'white',
              borderWidth: inlineStyle.borderWidth || '2px',
              borderColor: inlineStyle.borderColor || '#a855f7',
              borderStyle: inlineStyle.borderStyle || 'solid',
              fontFamily: inlineStyle.fontFamily || undefined,
              fontSize: inlineStyle.fontSize || undefined,
              color: inlineStyle.color || undefined,
            }}
          >
            {renderHandles()}
            {hasLink && (
              <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm">
                <Link2 className="w-3 h-3 text-white" />
              </div>
            )}
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

MainProcessNode.displayName = 'MainProcessNode'

/**
 * Nœud Processus Support - Rectangle en pointillés
 * Finance, RH, IT, etc.
 */
export const SupportProcessNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-blue-500',
    borderWidth: 2,
    icon: <Settings className="w-5 h-5 text-blue-600" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    isContainer: false,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
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
      
      return (
        <div className="relative w-full h-full" style={{ width: inlineStyle.width, height: inlineStyle.height }}>
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
            onCreateProcess={data?.onCreateProcess}
          />
          <div
            className={`relative rounded-lg px-5 py-4 min-w-[140px] min-h-[80px] flex items-center justify-center ${selectedClass} transition-all w-full h-full`}
            style={{
              backgroundColor: inlineStyle.backgroundColor || 'white',
              borderWidth: inlineStyle.borderWidth || '2px',
              borderColor: inlineStyle.borderColor || '#3b82f6',
              borderStyle: inlineStyle.borderStyle || 'dashed',
              fontFamily: inlineStyle.fontFamily || undefined,
              fontSize: inlineStyle.fontSize || undefined,
              color: inlineStyle.color || undefined,
            }}
          >
            {renderHandles()}
            {hasLink && (
              <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm">
                <Link2 className="w-3 h-3 text-white" />
              </div>
            )}
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

SupportProcessNode.displayName = 'SupportProcessNode'

/**
 * Nœud Processus Management - Hexagone
 * Stratégie et gouvernance
 */
export const ManagementProcessNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-purple-500',
    borderWidth: 2,
    icon: <Shield className="w-5 h-5 text-purple-600" />,
    resizable: true,
    minWidth: 120,
    minHeight: 120,
    maxWidth: 400,
    maxHeight: 400,
    isContainer: false,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
      { type: 'target', position: Position.Top },
      { type: 'source', position: Position.Bottom },
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
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
      
      return (
        <div className="relative w-full h-full" style={{ width: inlineStyle.width, height: inlineStyle.height }}>
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
            onCreateProcess={data?.onCreateProcess}
          />
          <div
            className={`relative min-w-[120px] min-h-[120px] flex flex-col items-center justify-center w-full h-full ${selectedClass} transition-all`}
            style={{
              fontFamily: inlineStyle.fontFamily || undefined,
              fontSize: inlineStyle.fontSize || undefined,
              color: inlineStyle.color || undefined,
            }}
          >
            {renderHandles()}
            {hasLink && (
              <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm z-20">
                <Link2 className="w-3 h-3 text-white" />
              </div>
            )}
            {/* Hexagon shape using CSS clip-path */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                backgroundColor: inlineStyle.backgroundColor || 'white',
                borderWidth: inlineStyle.borderWidth || '2px',
                borderColor: inlineStyle.borderColor || '#a855f7',
                borderStyle: inlineStyle.borderStyle || 'solid',
              }}
            />
            <div className="relative z-10 flex flex-row items-center justify-start gap-3 px-4 py-2 w-full h-full">
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

ManagementProcessNode.displayName = 'ManagementProcessNode'

/**
 * Nœud SIPOC - Rectangle arrondi avec bordure bleue
 * Processus de type SIPOC (Supplier Input Process Output Customer)
 */
export const SipocNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-blue-500',
    borderWidth: 2,
    icon: <Target className="w-5 h-5 text-blue-600" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 500,
    maxHeight: 400,
    isContainer: false,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
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
      
      return (
        <div className="relative w-full h-full" style={{ width: inlineStyle.width, height: inlineStyle.height }}>
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
            onCreateProcess={data?.onCreateProcess}
          />
          <div
            className={`relative min-w-[140px] min-h-[80px] flex flex-row items-center justify-start gap-3 px-4 py-2 rounded-lg w-full h-full ${selectedClass} transition-all`}
            style={{
              backgroundColor: inlineStyle.backgroundColor || 'white',
              borderWidth: inlineStyle.borderWidth || '2px',
              borderColor: inlineStyle.borderColor || '#3b82f6',
              borderStyle: inlineStyle.borderStyle || 'solid',
              fontFamily: inlineStyle.fontFamily || undefined,
              fontSize: inlineStyle.fontSize || undefined,
              color: inlineStyle.color || undefined,
            }}
          >
            {renderHandles()}
            {hasLink && (
              <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm z-20">
                <Link2 className="w-3 h-3 text-white" />
              </div>
            )}
            {renderIcon()}
            <div className="flex-1 min-w-0">
              {renderLabel()}
            </div>
          </div>
        </div>
      )
    },
  })
)

SipocNode.displayName = 'SipocNode'

/**
 * Nœud Groupe de Domaine - Grand conteneur
 * Organiser les processus
 */
export const DomainGroupNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'bg-gray-50',
    borderColor: 'border-gray-400',
    borderWidth: 2,
    icon: <Building2 className="w-5 h-5 text-gray-600" />,
    resizable: true,
    minWidth: 200,
    minHeight: 150,
    maxWidth: 3000,
    maxHeight: 1400,
    isContainer: true, // This node can contain other nodes as children
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }: any) => {
      
      
      // DomainGroupNodeWithPlus is a wrapper component that uses useNodes hook
      return <DomainGroupNodeWithPlus 
        data={data} 
        selected={selected} 
        renderHandles={renderHandles} 
        renderIcon={renderIcon} 
        renderLabel={renderLabel} 
        width={width} 
        height={height}
        id={id}
      />
    },
  })
)

DomainGroupNode.displayName = 'DomainGroupNode'

/**
 * Wrapper component for DomainGroupNode that uses useNodes hook
 * This allows us to detect children and display the plus button
 */
const DomainGroupNodeWithPlus = memo(({ 
  data, 
  selected, 
  renderHandles, 
  renderIcon, 
  renderLabel, 
  width, 
  height,
  id 
}: {
  data: any
  selected: boolean
  renderHandles: () => React.ReactNode
  renderIcon: () => React.ReactNode
  renderLabel: () => React.ReactNode
  width?: number | null
  height?: number | null
  id: string
}) => {
  const allNodes = useNodes()
  const readOnly = data?.readOnly || false
  const onAddMainProcess = data?.onAddMainProcess
  const onAddMultipleProcesses = data?.onAddMultipleProcesses
  const onAutoLayout = data?.onAutoLayout
  const onAIGenerate = data?.onAIGenerate

  // State for attachment menu
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const attachMenuRef = useRef<HTMLDivElement>(null)

  // Get attachment handlers and data
  const parentId = data?.parentId
  const availableGroups = (data?.availableContainers as Array<{ id: string; data?: { label?: string } }>) || []
  const onAttachToGroup = data?.onAttachToGroup as ((nodeId: string, groupId: string) => void) | undefined
  const onDetachFromGroup = data?.onDetachFromGroup as ((nodeId: string) => void) | undefined
  


  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target as HTMLElement)) {
        setShowAttachMenu(false)
      }
    }

    if (showAttachMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAttachMenu])

  // Filter children nodes (nodes with this group as parent)
  const children = allNodes.filter((n) => (n as any).parentId === id)

  const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow-md'
  const isHighlighted = data?.isHighlighted || false
  const bgColor = isHighlighted ? 'bg-orange-100' : 'bg-gray-50'
  
  const inlineStyle: any = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
  }
  if (data?.style?.backgroundColor) inlineStyle.backgroundColor = data.style.backgroundColor
  if (data?.style?.color) inlineStyle.color = data.style.color

  const isEmpty = children.length === 0
  const showPlusButton = !readOnly && onAddMainProcess
  const showAutoLayoutButton = !readOnly && onAutoLayout && children.length > 0
  const showAddMultipleButton = !readOnly && onAddMultipleProcesses
  const showAIGenerateButton = !readOnly && onAIGenerate

  return (
    <div
      className={`${bgColor} border-2 border-gray-400 border-dashed rounded-xl px-6 py-5 min-w-[200px] min-h-[150px] flex flex-col w-full h-full ${selectedClass} transition-all relative`}
      style={inlineStyle}
    >
      {renderHandles()}

      {/* Toolbar for group operations */}
      {selected && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-1 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {parentId ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (onDetachFromGroup) {
                  onDetachFromGroup(id)
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white rounded p-1.5 shadow-sm transition-colors"
              title="Détacher du groupe parent"
            >
              <Unlink className="w-4 h-4" />
            </button>
          ) : (
            <div className="relative" ref={attachMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAttachMenu(!showAttachMenu)
                }}
                className="bg-green-500 hover:bg-green-600 text-white rounded p-1.5 shadow-sm transition-colors"
                title="Attacher à un autre groupe"
              >
                <Link className="w-4 h-4" />
              </button>
              {showAttachMenu && availableGroups && availableGroups.length > 0 && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-md shadow-xl border border-gray-200 py-1 min-w-[200px] max-h-[300px] overflow-y-auto z-20">
                  {availableGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Attaching node', id, 'to group', group.id,onAttachToGroup)
                        if (onAttachToGroup) {

                          onAttachToGroup(id, group.id)
                        }
                        setShowAttachMenu(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-orange-50 transition-colors text-sm"
                    >
                      {group.data?.label || group.id}
                    </button>
                  ))}
                </div>
              )}
              {showAttachMenu && (!availableGroups || availableGroups.length === 0) && (
                <div className="absolute top-full mt-1 left-0 bg-white rounded-md shadow-xl border border-gray-200 py-2 px-3 min-w-[200px] z-20 text-xs text-gray-500">
                  Aucun autre groupe disponible
                </div>
              )}
            </div>
          )}
          {showAutoLayoutButton && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAutoLayout?.(id)
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded p-1.5 shadow-sm transition-colors"
              title="Réorganiser automatiquement les processus"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          )}
          {showAddMultipleButton && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddMultipleProcesses?.(id)
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded p-1.5 shadow-sm transition-colors"
              title="Ajouter plusieurs processus"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          {showAIGenerateButton && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAIGenerate?.(id)
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded p-1.5 shadow-sm transition-colors"
              title="Générer avec l'IA"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      <div className="flex items-center justify-between gap-2 mb-3 border-b border-gray-300 pb-2">
        <div className="flex items-center justify-center gap-2">
          {renderIcon()}
          {renderLabel()}
        </div>
      </div>
      {/* Conteneur pour les processus enfants */}
      <div className="flex-1 flex items-center justify-center text-gray-400 text-xs relative">
        {isEmpty && !showPlusButton && (data?.description || 'Glissez des processus ici')}
      </div>
      
      {/* Plus button - center when empty, right when has children */}
      {/* {showPlusButton && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddMainProcess?.(id)
          }}
          className={`absolute z-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110 pointer-events-auto ${
            isEmpty 
              ? 'left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2' 
              : 'right-3 top-1/2 transform -translate-y-1/2'
          }`}
          title="Ajouter un processus principal"
        >
          <Plus className="w-5 h-5" />
        </button>
      )} */}
    </div>
  )
})

DomainGroupNodeWithPlus.displayName = 'DomainGroupNodeWithPlus'

/**
 * Nœud Acteur/Département - Forme pill
 * Qui est responsable
 */
export const ActorDepartmentNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-green-500',
    borderWidth: 2,
    icon: <Users className="w-5 h-5 text-green-600" />,
    resizable: true,
    minWidth: 120,
    minHeight: 50,
    maxWidth: 300,
    maxHeight: 80,
    isContainer: false,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      
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
      
      return (
        <div className="relative w-full h-full" style={{ width: inlineStyle.width, height: inlineStyle.height }}>
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
            onCreateProcess={data?.onCreateProcess}
          />
          <div
            className={`relative rounded-full px-6 py-3 min-w-[120px] min-h-[50px] flex items-center justify-start gap-3 w-full h-full ${selectedClass} transition-all`}
            style={{
              ...inlineStyle,
              backgroundColor: inlineStyle.backgroundColor || 'white',
              borderWidth: inlineStyle.borderWidth || '2px',
              borderColor: inlineStyle.borderColor || '#22c55e',
              borderStyle: inlineStyle.borderStyle || 'solid',
            }}
          >
            {renderHandles()}
            {renderIcon()}
            <div className="flex-1 min-w-0">
              {renderLabel()}
            </div>
          </div>
        </div>
      )
    },
  })
)

ActorDepartmentNode.displayName = 'ActorDepartmentNode'

/**
 * Nœud Entité Externe - Parallélogramme
 * Client / Fournisseur
 */
export const ExternalEntityNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-orange-500',
    borderWidth: 2,
    icon: <Globe className="w-5 h-5 text-orange-600" />,
    resizable: true,
    minWidth: 140,
    minHeight: 80,
    maxWidth: 400,
    maxHeight: 200,
    isContainer: false,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderIcon, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      
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
      
      return (
        <div className="relative w-full h-full" style={{ width: inlineStyle.width, height: inlineStyle.height }}>
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
            onCreateProcess={data?.onCreateProcess}
          />
          <div
            className={`relative min-w-[140px] min-h-[80px] flex items-center justify-center w-full h-full ${selectedClass} transition-all`}
            style={{
              fontFamily: inlineStyle.fontFamily || undefined,
              fontSize: inlineStyle.fontSize || undefined,
              color: inlineStyle.color || undefined,
            }}
          >
            {renderHandles()}
            {/* Forme parallélogramme utilisant la transformation CSS */}
            <div
              className="absolute inset-0 flex items-center justify-start gap-3 px-5 py-4"
              style={{
                transform: 'skewX(-15deg)',
                backgroundColor: inlineStyle.backgroundColor || 'white',
                borderWidth: inlineStyle.borderWidth || '2px',
                borderColor: inlineStyle.borderColor || '#f97316',
                borderStyle: inlineStyle.borderStyle || 'solid',
              }}
            >
              <div style={{ transform: 'skewX(15deg)' }} className="flex flex-row items-center justify-start gap-3 w-full">
                {renderIcon()}
                <div className="flex-1 min-w-0">
                  {renderLabel()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
  })
)

ExternalEntityNode.displayName = 'ExternalEntityNode'

/**
 * Nœud Rectangle Simple - Rectangle sans icône
 * Élément générique pour tous les niveaux
 */
export const SimpleRectangleNode = createNode(
  defineNodeConfig({
    shape: 'custom',
    backgroundColor: 'white',
    borderColor: 'border-gray-500',
    borderWidth: 2,
    // Pas d'icône définie
    resizable: true,
    minWidth: 120,
    minHeight: 60,
    maxWidth: 1000,
    maxHeight: 800,
    isContainer: true,
    handles: [
      HANDLE_CONFIGS.targetLeft,
      HANDLE_CONFIGS.sourceRight,
    ],
    showLabel: true,
    labelPosition: 'inside',
    customRender: ({ data, selected, renderHandles, renderLabel, width, height, id }) => {
      const selectedClass = selected ? 'ring-4 ring-orange-400 ring-opacity-50 shadow-lg' : 'shadow'
      const hasLink = !!data?.linkedProcessId
      
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
      
      return (
        <div className="relative w-full h-full" style={{ width: inlineStyle.width, height: inlineStyle.height }}>
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
            onCreateProcess={data?.onCreateProcess}
          />
          <div
            className={`relative rounded-lg px-5 py-4 min-w-[120px] min-h-[60px] flex items-start justify-center w-full h-full ${selectedClass} transition-all`}
            style={{
              backgroundColor: inlineStyle.backgroundColor || 'white',
              borderWidth: inlineStyle.borderWidth || '2px',
              borderColor: inlineStyle.borderColor || '#6b7280',
              borderStyle: inlineStyle.borderStyle || 'solid',
              fontFamily: inlineStyle.fontFamily || undefined,
              fontSize: inlineStyle.fontSize || undefined,
              color: inlineStyle.color || undefined,
            }}
          >
            {renderHandles()}
            {hasLink && (
              <div className="absolute top-1 right-1 bg-orange-500 rounded-full p-1 shadow-sm">
                <Link2 className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="w-full text-center">
              {renderLabel()}
            </div>
          </div>
        </div>
      )
    },
  })
)

SimpleRectangleNode.displayName = 'SimpleRectangleNode'

