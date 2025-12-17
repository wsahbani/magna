import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  ReactFlowInstance,
  OnSelectionChangeParams,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Hooks
import { useHierarchicalDrag } from '../../hooks/useHierarchicalDrag'
import { useSaveFlow, useLoadFlow, useAutoSaveFlow } from '../../hooks/useFlowPersistence'
import { useFlowState } from './hooks/useFlowState'
import { useHelperLines } from './hooks/useHelperLines'
import { useNodeGrouping } from './hooks/useNodeGrouping'
import { useGroupDragDrop } from './hooks/useGroupDragDrop'
import { useFlowLoading } from './hooks/useFlowLoading'
import { useFlowAutoSave, useManualSave } from './hooks/useFlowSaving'

// Components
import { Toolbar } from './Toolbar'
import { HelperLinesOverlay } from './components/HelperLinesOverlay'

// Utils
import { GridSettings, getBackgroundVariant } from './utils/gridUtils'
import { getNodeColor } from './utils/nodeColors'
import { nodeTypes } from './nodeTypes'


export interface FlowBuilderProps {
  nodes: Node[]
  edges: Edge[]
  onNodesChange: (changes: any) => void
  onEdgesChange: (changes: any) => void
  onConnect?: (connection: Connection) => void
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onInit?: (instance: ReactFlowInstance) => void
  onSelectionChange?: (params: OnSelectionChangeParams) => void
  gridSettings?: GridSettings
  showHelperLines?: boolean
  readOnly?: boolean
  // Flow persistence props
  processVersionId?: string | null
  enableAutoSave?: boolean
  autoSaveDelay?: number
  onLoadSuccess?: (nodes: Node[], edges: Edge[]) => void
  onLoadError?: (error: Error) => void
  onSaveSuccess?: (message: string) => void
  onSaveError?: (error: Error) => void
}

export function FlowBuilder({ 
  nodes, 
  edges,
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
  onConnect: onConnectProp,
  onSave,
  onInit,
  onSelectionChange,
  gridSettings = { snapToGrid: false, gridSize: 15, showGrid: true, backgroundPattern: 'dots' },
  showHelperLines = true,
  readOnly = false,
  // Flow persistence props
  processVersionId = null,
  enableAutoSave = true,
  autoSaveDelay = 2000,
  onLoadSuccess,
  onLoadError,
  onSaveSuccess,
  onSaveError
}: FlowBuilderProps) {
  
  // === State Management ===
  const {
    helperLines,
    setHelperLines,
    reactFlowInstance,
    setReactFlowInstance,
    groupCounter,
    setGroupCounter,
    isLoaded,
    setIsLoaded,
    nodesRef,
    edgesRef,
  } = useFlowState(nodes, edges)

  // === Flow Persistence ===
  const saveFlowMutation = useSaveFlow()
  const { data: loadedFlow, isLoading: isLoadingFlow, error: loadError } = useLoadFlow(processVersionId)
  const { autoSave, isAutoSaving, autoSaveError } = useAutoSaveFlow(processVersionId, autoSaveDelay)
   
  // === Load Flow ===
  useFlowLoading({
    loadedFlow: loadedFlow ?? null,
    isLoaded,
    setIsLoaded,
    onNodesChange: onNodesChangeProp,
    onEdgesChange: onEdgesChangeProp,
    onLoadSuccess,
    onLoadError,
    loadError,
  })

  // === Auto-Save ===
  useFlowAutoSave({
    enableAutoSave,
    isLoaded,
    processVersionId,
    nodesRef,
    edgesRef,
    autoSave,
    saveFlowMutation: saveFlowMutation as any,
    autoSaveError,
    onSaveSuccess,
    onSaveError,
  })

  // === Manual Save ===
  const handleManualSave = useManualSave(
    processVersionId,
    nodes,
    edges,
    saveFlowMutation as any,
    onSave,
    onSaveSuccess,
    onSaveError
  )
  
  // === Helper Lines ===
  const { calculateHelperLines, clearHelperLines } = useHelperLines(
    nodes,
    showHelperLines,
    setHelperLines
  )
  
  // === Node Grouping ===
  const { createGroup, ungroupSelected } = useNodeGrouping(
    nodes,
    onNodesChangeProp,
    groupCounter,
    setGroupCounter
  )
  
  // === Group Drag & Drop ===
  const { handleNodeDragStop: handleGroupDragStop } = useGroupDragDrop(
    nodes,
    onNodesChangeProp,
    reactFlowInstance
  )
  
  // === Hierarchical Drag ===
  const {
    handleNodeDragStart: hierarchicalDragStart,
    handleNodeDrag: hierarchicalDrag,
    handleNodeDragStop: hierarchicalDragStop,
  } = useHierarchicalDrag({
    nodes,
    onNodesChange: onNodesChangeProp,
    enabled: true,
  })
  
  // === Event Handlers ===
  const onNodeDrag = useCallback(
    (event: any, node: Node) => {
      hierarchicalDrag(event, node)
      calculateHelperLines(node)
    },
    [hierarchicalDrag, calculateHelperLines]
  )

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      hierarchicalDragStop()
      clearHelperLines()
      handleGroupDragStop(event, node)
    },
    [hierarchicalDragStop, clearHelperLines, handleGroupDragStop]
  )

  const onConnect = useCallback(
    (params: Connection) => {
      if (onConnectProp) {
        onConnectProp(params)
      }
    },
    [onConnectProp]
  )

  const handleInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance)
    if (onInit) {
      onInit(instance)
    }
  }, [onInit, setReactFlowInstance])

  // === Selection State ===
  const selectedNodes = nodes.filter((node) => node.selected)
  const selectedNodeCount = selectedNodes.length
  const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null

  // === Background Variant ===
  const backgroundVariant = getBackgroundVariant(gridSettings.backgroundPattern)

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeProp}
        onEdgesChange={onEdgesChangeProp}
        onConnect={onConnect}
        onInit={handleInit}
        onSelectionChange={onSelectionChange}
        onNodeDragStart={hierarchicalDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={gridSettings.snapToGrid}
        snapGrid={[gridSettings.gridSize, gridSettings.gridSize]}
        fitView
        attributionPosition="bottom-right"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        deleteKeyCode={readOnly ? null : 'Delete'}
        multiSelectionKeyCode="Control"
      >
        {/* Top Toolbar */}
        {!readOnly && (
          <Panel position="top-left" className="bg-white shadow-lg rounded-lg border border-gray-200 p-2">
            <Toolbar
              onSave={handleManualSave}
              onGroup={createGroup}
              onUngroup={ungroupSelected}
              hasSelectedNode={!!selectedNode}
              selectedNodeCount={selectedNodeCount}
              isGroupSelected={selectedNode?.type === 'group'}
              isSaving={saveFlowMutation.isPending}
              isAutoSaving={isAutoSaving}
              saveError={saveFlowMutation.error || autoSaveError}
              isLoadingFlow={isLoadingFlow}
            />
          </Panel>
        )}

        {/* Background pattern */}
        {gridSettings.showGrid && backgroundVariant && (
          <Background 
            variant={backgroundVariant}
            gap={gridSettings.gridSize}
            size={gridSettings.backgroundPattern === 'dots' ? 1 : 0.5}
            color={gridSettings.backgroundPattern === 'lines' ? '#ddd' : '#ddd'}
            className="bg-gray-50"
          />
        )}
        
        {/* Controls */}
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          position="bottom-right"
        />
        
        {/* Minimap */}
        <MiniMap 
          nodeColor={getNodeColor}
          position="bottom-left"
          pannable
          zoomable
        />

        {/* Helper Lines Overlay */}
        {showHelperLines && (
          <HelperLinesOverlay 
            horizontal={helperLines.horizontal}
            vertical={helperLines.vertical}
          />
        )}
      </ReactFlow>
    </div>
  )
}


