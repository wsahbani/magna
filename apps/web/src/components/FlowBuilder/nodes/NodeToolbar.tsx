/**
 * NodeToolbar Component
 * Floating toolbar for selected nodes with style, handle position, and attach/detach options
 */

import { memo, useState, useEffect, useRef } from 'react'
import { 
  Link, 
  Unlink, 
  Palette, 
  Type, 
  Minus, 
  Plus,
  Move,
  ArrowUpDown,
  ArrowLeftRight,
  FilePlus
} from 'lucide-react'
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

export interface NodeToolbarProps {
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
  onCreateProcess?: (nodeId: string) => void
}

export const NodeToolbar = memo(({ 
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
  onCreateProcess
}: NodeToolbarProps) => {
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
      {/* Bouton Créer Process (uniquement pour les nœuds Process dans Process Map) */}
      {onCreateProcess && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCreateProcess(nodeId)
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white rounded p-1.5 shadow-sm transition-colors"
          title="Créer Process"
        >
          <FilePlus className="w-4 h-4" />
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
              setShowHandleMenu(false)
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


