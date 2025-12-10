import { Button } from '@repo/ui'
import { 
  Save, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Move,
  Grid3x3,
  Grid2x2,
  FolderPlus,
  Ungroup,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'

export type HandlePosition = 'top' | 'right' | 'bottom' | 'left'
export type BackgroundPattern = 'dots' | 'lines' | 'cross' | 'none'

export interface GridSettings {
  snapToGrid: boolean
  gridSize: number
  showGrid: boolean
  backgroundPattern: BackgroundPattern
}

interface ToolbarProps {
  onSave?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitView?: () => void
  onDelete?: () => void
  onCopy?: () => void
  onAlignLeft?: () => void
  onAlignCenter?: () => void
  onAlignRight?: () => void
  onGroup?: () => void
  onUngroup?: () => void
  onChangeHandlePosition?: (sourcePos: HandlePosition, targetPos: HandlePosition) => void
  onGridSettingsChange?: (settings: GridSettings) => void
  onHelperLinesToggle?: (show: boolean) => void
  hasSelectedNode?: boolean
  selectedNodeCount?: number
  isGroupSelected?: boolean
  gridSettings?: GridSettings
  showHelperLines?: boolean
  canUndo?: boolean
  canRedo?: boolean
  // Save status props
  isSaving?: boolean
  isAutoSaving?: boolean
  saveError?: Error | null
  isLoadingFlow?: boolean
}

export function Toolbar({
  onSave,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitView,
  onDelete,
  onCopy,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onGroup,
  onUngroup,
  onChangeHandlePosition,
  onGridSettingsChange,
  onHelperLinesToggle,
  hasSelectedNode = false,
  selectedNodeCount = 0,
  isGroupSelected = false,
  gridSettings = { snapToGrid: false, gridSize: 15, showGrid: true, backgroundPattern: 'dots' },
  showHelperLines = true,
  canUndo = false,
  canRedo = false,
  // Save status props
  isSaving = false,
  isAutoSaving = false,
  saveError = null,
  isLoadingFlow = false,
}: ToolbarProps) {
  const [showHandleMenu, setShowHandleMenu] = useState(false)
  const [showGridMenu, setShowGridMenu] = useState(false)
  const [sourcePosition, setSourcePosition] = useState<HandlePosition>('right')
  const [targetPosition, setTargetPosition] = useState<HandlePosition>('left')
  const [localGridSettings, setLocalGridSettings] = useState<GridSettings>(gridSettings)

  const handleApplyPosition = () => {
    if (onChangeHandlePosition) {
      onChangeHandlePosition(sourcePosition, targetPosition)
      setShowHandleMenu(false)
    }
  }

  const handleGridSettingChange = (key: keyof GridSettings, value: any) => {
    const newSettings = { ...localGridSettings, [key]: value }
    setLocalGridSettings(newSettings)
    if (onGridSettingsChange) {
      onGridSettingsChange(newSettings)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Save Actions */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={!onSave || isSaving || isLoadingFlow}
          className="h-9"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        
        {/* Auto-save status indicator */}
        {isAutoSaving && (
          <div className="flex items-center text-xs text-gray-500 ml-2">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Enregistrement automatique...
          </div>
        )}
        
        {/* Save error indicator */}
        {saveError && (
          <div className="flex items-center text-xs text-red-500 ml-2" title={saveError.message}>
            <AlertCircle className="w-3 h-3 mr-1" />
            Échec de l'enregistrement
          </div>
        )}
        
        {/* Loading flow indicator */}
        {isLoadingFlow && (
          <div className="flex items-center text-xs text-blue-500 ml-2">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Chargement...
          </div>
        )}
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-9 w-9"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-9 w-9"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          className="h-9 w-9"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          className="h-9 w-9"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onFitView}
          className="h-9 w-9"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* Edit Actions */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="h-9 w-9"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-9 w-9"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Group/Ungroup */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={onGroup}
          disabled={selectedNodeCount === 0}
          className="h-9 px-3 flex items-center gap-1 rounded-md border transition-colors bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-50"
        >
          <FolderPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Group ({selectedNodeCount})</span>
        </button>
        <button
          onClick={onUngroup}
          disabled={!isGroupSelected}
          className="h-9 px-3 flex items-center gap-1 rounded-md border transition-colors bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-50"
        >
          <Ungroup className="w-4 h-4" />
          <span className="text-sm font-medium">Ungroup</span>
        </button>
      </div>

      {/* Grid Settings */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGridMenu(!showGridMenu)}
          className="h-9"
        >
          <Grid3x3 className="w-4 h-4 mr-2" />
          Grid
        </Button>
        
        {showGridMenu && (
          <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-700 mb-3">Grid Settings</div>
              
              {/* Show Grid Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Show Grid</label>
                <button
                  onClick={() => handleGridSettingChange('showGrid', !localGridSettings.showGrid)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localGridSettings.showGrid ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localGridSettings.showGrid ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Snap to Grid Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Aligner à la grille</label>
                <button
                  onClick={() => handleGridSettingChange('snapToGrid', !localGridSettings.snapToGrid)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localGridSettings.snapToGrid ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localGridSettings.snapToGrid ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Helper Lines Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Afficher les lignes d'aide</label>
                <button
                  onClick={() => onHelperLinesToggle?.(!showHelperLines)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showHelperLines ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showHelperLines ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Grid Size */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Taille de la grille : {localGridSettings.gridSize}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={localGridSettings.gridSize}
                  onChange={(e) => handleGridSettingChange('gridSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5px</span>
                  <span>25px</span>
                  <span>50px</span>
                </div>
              </div>
              
              {/* Background Pattern */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Motif</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['dots', 'lines', 'cross', 'none'] as BackgroundPattern[]).map((pattern) => (
                    <button
                      key={pattern}
                      onClick={() => handleGridSettingChange('backgroundPattern', pattern)}
                      className={`px-3 py-2 text-xs rounded border-2 transition-all capitalize ${
                        localGridSettings.backgroundPattern === pattern
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      {pattern === 'dots' && <Grid2x2 className="w-4 h-4 mx-auto" />}
                      {pattern === 'lines' && <div className="text-center">═</div>}
                      {pattern === 'cross' && <Grid3x3 className="w-4 h-4 mx-auto" />}
                      {pattern === 'none' && <div className="text-center">∅</div>}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  <span className="text-xs text-gray-500 text-center">Points</span>
                  <span className="text-xs text-gray-500 text-center">Lignes</span>
                  <span className="text-xs text-gray-500 text-center">Croix</span>
                  <span className="text-xs text-gray-500 text-center">Aucun</span>
                </div>
              </div>
              
              {/* Close Button */}
              <div className="pt-2 border-t">
                <button
                  onClick={() => setShowGridMenu(false)}
                  className="w-full px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Handle Position */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHandleMenu(!showHandleMenu)}
          disabled={!hasSelectedNode}
          className="h-9"
        >
          <Move className="w-4 h-4 mr-2" />
          Poignées
        </Button>
        
        {showHandleMenu && (
          <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-72">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-700 mb-3">Changer les positions des poignées</div>
              
              {/* Source Handle Position */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Sortie (Source)</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['top', 'right', 'bottom', 'left'] as HandlePosition[]).map((pos) => (
                    <button
                      key={`source-${pos}`}
                      onClick={() => setSourcePosition(pos)}
                      className={`px-3 py-2 text-xs rounded border-2 transition-all ${
                        sourcePosition === pos
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Target Handle Position */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Entrée (Cible)</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['top', 'right', 'bottom', 'left'] as HandlePosition[]).map((pos) => (
                    <button
                      key={`target-${pos}`}
                      onClick={() => setTargetPosition(pos)}
                      className={`px-3 py-2 text-xs rounded border-2 transition-all ${
                        targetPosition === pos
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Apply Button */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={handleApplyPosition}
                  className="flex-1 px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                >
                  Appliquer
                </button>
                <button
                  onClick={() => setShowHandleMenu(false)}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alignment Tools */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onAlignLeft}
          className="h-9 w-9"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAlignCenter}
          className="h-9 w-9"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAlignRight}
          className="h-9 w-9"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
