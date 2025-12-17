import { useParams } from '@tanstack/react-router'
import { useCallback, useRef, useState, useEffect } from 'react'
import { useProcess } from '../hooks/useProcesses'
import { Body } from '@repo/ui'
import { EditorLayout } from '../../../layouts/EditorLayout'
import { FlowBuilder } from '../../../components/FlowBuilder'
import { Palette } from '../../../components/FlowBuilder/Palette'
import { PropertiesPanel } from '../../../components/FlowBuilder/PropertiesPanel'
import { Toolbar, GridSettings } from '../../../components/FlowBuilder/Toolbar'
import { ReactFlowInstance, Node, Edge, Connection } from '@xyflow/react'
import { useFlowStore } from '../../../stores/flowStore'
import { useSaveFlow, useLoadFlow } from '../../../hooks/useFlowPersistence'
import { useFlowChanges } from '../../../hooks/useFlowChanges'

export default function FlowDetailPage() {
  const { id } = useParams({ from: '/processes/flow/$id' })
  const { data: process, isLoading } = useProcess(id)
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    snapToGrid: false,
    gridSize: 15,
    showGrid: true,
    backgroundPattern: 'dots',
  })
  const [showHelperLines, setShowHelperLines] = useState(true)
  
  // Flow persistence hooks
  const saveFlowMutation = useSaveFlow()
  const { data: loadedFlow, isLoading: isLoadingFlow } = useLoadFlow(id || null)
  
  // Flow change tracking for deletions
  const {
    initializeTracking,
    addNodeActions,
    addEdgeActions,
    getDeletedNodes,
    getDeletedEdges,
  } = useFlowChanges()
  
  // Use Zustand store for flow state
  const {
    nodes,
    edges,
    selectedNodes,
    selectedEdges,
    addNode,
    addEdge,
    updateNode,
    updateEdge,
    updateNodeHandles,
    deleteNode,
    deleteEdge,
    onNodesChange,
    onEdgesChange,
    setSelectedNodes,
    setSelectedEdges,
    loadFlow,
    markAsSaved,
    setProcessId,
  } = useFlowStore()
  
  const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null
  const selectedEdge = selectedEdges.length === 1 ? selectedEdges[0] : null
  
  // Load flow data when process is loaded
  useEffect(() => {
    if (process && id) {
      setProcessId(id)
      
      // Load flow from API if available
      if (loadedFlow) {
        loadFlow(loadedFlow.nodes, loadedFlow.edges, id)
        // Initialize tracking with loaded data
        initializeTracking(loadedFlow.nodes, loadedFlow.edges)
      } else {
        // Start with empty flow if no saved data
        loadFlow([], [], id)
        // Initialize tracking with empty state
        initializeTracking([], [])
      }
    }
  }, [process, id, loadedFlow, setProcessId, loadFlow, initializeTracking])

  // Drag and drop from palette
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      if (!type || !reactFlowInstance) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addNode({
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
          description: ''
        },
      })
    },
    [reactFlowInstance, addNode]
  )

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      addEdge(params)
    },
    [addEdge]
  )

  // Node/Edge selection
  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[], edges: Edge[] }) => {
    setSelectedNodes(nodes)
    setSelectedEdges(edges)
  }, [setSelectedNodes, setSelectedEdges])

  // Update properties
  const onNodeUpdate = useCallback((nodeId: string, data: Partial<Node['data']>) => {
    updateNode(nodeId, data)
  }, [updateNode])

  const onEdgeUpdate = useCallback((edgeId: string, data: Partial<Edge>) => {
    updateEdge(edgeId, data)
  }, [updateEdge])

  // Toolbar actions
  const handleSave = useCallback(async () => {
    if (!id) {
      alert('No process ID available to save')
      return
    }
    
    try {
      // Add action flags to current nodes/edges
      const nodesWithActions = addNodeActions(nodes)
      const edgesWithActions = addEdgeActions(edges)
      
      // Get deleted nodes/edges
      const deletedNodes = getDeletedNodes(nodes)
      const deletedEdges = getDeletedEdges(edges)
      
      console.log('Saving flow:', {
        nodes: { current: nodesWithActions.length, deleted: deletedNodes.length },
        edges: { current: edgesWithActions.length, deleted: deletedEdges.length }
      })
      
      await saveFlowMutation.mutateAsync({
        processId: id,
        nodes: nodesWithActions,
        edges: edgesWithActions,
        changesLog: 'Manual save from flow editor',
        deletedNodes,
        deletedEdges,
      })
      
      // Re-initialize tracking with current state
      initializeTracking(nodes, edges)
      markAsSaved()
      
      // TODO: Replace with toast notification
      alert('Flow saved successfully!')
    } catch (error) {
      console.error('Failed to save flow:', error)
      // TODO: Replace with toast notification
      alert('Failed to save flow: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }, [id, nodes, edges, saveFlowMutation, markAsSaved, addNodeActions, addEdgeActions, getDeletedNodes, getDeletedEdges, initializeTracking])

  const handleDelete = useCallback(() => {
    if (selectedNode) {
      deleteNode(selectedNode.id)
    }
    if (selectedEdge) {
      deleteEdge(selectedEdge.id)
    }
  }, [selectedNode, selectedEdge, deleteNode, deleteEdge])

  const handleChangeHandlePosition = useCallback((sourcePos: string, targetPos: string) => {
    if (selectedNode) {
      updateNodeHandles(selectedNode.id, sourcePos, targetPos)
    }
  }, [selectedNode, updateNodeHandles])

  const handleZoomIn = useCallback(() => {
    reactFlowInstance?.zoomIn()
  }, [reactFlowInstance])

  const handleZoomOut = useCallback(() => {
    reactFlowInstance?.zoomOut()
  }, [reactFlowInstance])

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView()
  }, [reactFlowInstance])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Body>Loading process...</Body>
      </div>
    )
  }

  if (!process) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Body>Process not found</Body>
      </div>
    )
  }

  return (
    <EditorLayout
      title={process.name}
      toolbar={
        <Toolbar
          onSave={handleSave}
          onDelete={handleDelete}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onChangeHandlePosition={handleChangeHandlePosition}
          onGridSettingsChange={setGridSettings}
          onHelperLinesToggle={setShowHelperLines}
          hasSelectedNode={!!selectedNode}
          gridSettings={gridSettings}
          showHelperLines={showHelperLines}
          isSaving={saveFlowMutation.isPending}
          saveError={saveFlowMutation.error}
          isLoadingFlow={isLoadingFlow}
        />
      }
      palette={<Palette onDragStart={onDragStart} />}
      canvas={
        <div ref={reactFlowWrapper} className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
          <FlowBuilder
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onSelectionChange={onSelectionChange}
            gridSettings={gridSettings}
            showHelperLines={showHelperLines}
            processVersionId={id || null}
            enableAutoSave={false}
            autoSaveDelay={2000}
            onSaveSuccess={(message) => console.log('Auto-save success:', message)}
            onSaveError={(error) => console.error('Auto-save error:', error)}
            onLoadSuccess={(nodes, edges) => console.log('Flow loaded:', nodes.length, 'nodes')}
            onLoadError={(error) => console.error('Load error:', error)}
          />
        </div>
      }
      properties={
        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeUpdate={onNodeUpdate}
          onEdgeUpdate={onEdgeUpdate}
        />
      }
    />
  )
}
