/**
 * FlowEditor Component
 * Powerful ReactFlow editor with full CRUD capabilities for nodes and edges
 * Supports parent-child relationships and hierarchical grouping
 */

import { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  NodeTypes,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Heading3, Body, Button } from '@repo/ui'
import { GroupNode } from '../../../components/FlowBuilder/nodes/GroupNode'
import { Toolbar } from '../../../components/FlowBuilder/Toolbar'
import { useHierarchicalDrag } from '../../../hooks/useHierarchicalDrag'

// Define node types with GroupNode
const nodeTypes: NodeTypes = {
  group: GroupNode,
  // Add more node types as needed
}

interface FlowEditorProps {
  processId?: string
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onSave?: (nodes: Node[], edges: Edge[]) => void
}

export function FlowEditor({ 
  processId: _processId,  // Prefixed with _ to indicate intentionally unused
  initialNodes = [], 
  initialEdges = [],
  onSave 
}: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [groupCounter, setGroupCounter] = useState(1)
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  // Track selected nodes from ReactFlow's native selection
  const selectedNodes = nodes.filter((node) => node.selected)
  const selectedNodeCount = selectedNodes.length

  // Hierarchical drag behavior
  const {
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
  } = useHierarchicalDrag({
    nodes,
    onNodesChange,
    enabled: true,
  })

  // Update selectedNode when selection changes
  useEffect(() => {
    if (selectedNodes.length === 1) {
      setSelectedNode(selectedNodes[0])
    } else if (selectedNodes.length === 0) {
      setSelectedNode(null)
    }
  }, [selectedNodes])

  // Toolbar handlers
  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 })
  }, [zoomIn])

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 })
  }, [zoomOut])

  const handleFitView = useCallback(() => {
    fitView({ duration: 200, padding: 0.2 })
  }, [fitView])

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }, [])

  // Handle edge selection
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }, [])

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [])

  // Add new node (kept for future use)
  // const addNode = useCallback((type: string) => {
  //   const newNode: Node = {
  //     id: `node-${Date.now()}`,
  //     type,
  //     position: { x: Math.random() * 500, y: Math.random() * 500 },
  //     data: { 
  //       label: `New ${type}`,
  //       description: '',
  //     },
  //   }
  //   setNodes((nds) => [...nds, newNode])
  // }, [setNodes])

  // Delete selected node
  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  // Delete selected edge
  const deleteEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id))
      setSelectedEdge(null)
    }
  }, [selectedEdge, setEdges])

  // Create group from selected nodes
  const createGroup = useCallback(() => {
    if (selectedNodeCount === 0) {
      alert('Please select nodes to group (hold Ctrl and click multiple nodes)')
      return
    }

    const selectedNodeIds = selectedNodes.map((n) => n.id)
    
    // Calculate bounding box for selected nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    selectedNodes.forEach((node) => {
      minX = Math.min(minX, node.position.x)
      minY = Math.min(minY, node.position.y)
      maxX = Math.max(maxX, node.position.x + 150) // Assume node width ~150
      maxY = Math.max(maxY, node.position.y + 100) // Assume node height ~100
    })

    // Add padding
    const padding = 40
    const groupX = minX - padding
    const groupY = minY - padding
    const groupWidth = maxX - minX + padding * 2
    const groupHeight = maxY - minY + padding * 2

    const groupId = `group-${Date.now()}`

    const newGroup: Node = {
      id: groupId,
      type: 'group',
      position: { x: groupX, y: groupY },
      style: {
        width: groupWidth,
        height: groupHeight,
      },
      data: {
        label: `Group ${groupCounter}`,
        isGroup: true,
        groupType: 'category',
        childIds: selectedNodeIds,
        collapsed: false,
      },
    }

    // Update children to be positioned relative to parent and set parentNode
    const updatedNodes = nodes.map((node) => {
      if (selectedNodeIds.includes(node.id)) {
        return {
          ...node,
          position: {
            x: node.position.x - groupX,
            y: node.position.y - groupY,
          },
          parentNode: groupId,
          extent: 'parent' as const,
          data: {
            ...node.data,
            parentId: groupId,
          },
          selected: false,
        }
      }
      return node
    })

    setNodes([...updatedNodes, newGroup])
    setGroupCounter(groupCounter + 1)
  }, [selectedNodeCount, selectedNodes, nodes, setNodes, groupCounter])
  // Ungroup selected group
  const ungroupSelected = useCallback(() => {
    if (!selectedNode || selectedNode.type !== 'group') {
      alert('Please select a group node to ungroup')
      return
    }

    const groupId = selectedNode.id
    const groupPosition = selectedNode.position
    const childIds: string[] = Array.isArray(selectedNode.data?.childIds) 
      ? (selectedNode.data.childIds as string[])
      : []
    
    // Update children to absolute positions and remove parent
    const updatedNodes = nodes
      .filter((n) => n.id !== groupId) // Remove group node
      .map((node) => {
        if (childIds.includes(node.id)) {
          return {
            ...node,
            position: {
              x: node.position.x + groupPosition.x,
              y: node.position.y + groupPosition.y,
            },
            parentNode: undefined,
            extent: undefined,
            data: {
              ...node.data,
              parentId: null,
            },
          }
        }
        return node
      })

    setNodes(updatedNodes)
    setSelectedNode(null)
  }, [selectedNode, nodes, setNodes])

  // Save diagram
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges)
    }
  }, [nodes, edges, onSave])

  return (
    <div className="w-full h-[calc(100vh-12rem)] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeDragStart={handleNodeDragStart}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        multiSelectionKeyCode="Control"
      >
        {/* Background pattern */}
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#ff6900"
          className="bg-gray-50"
        />
        
        {/* Controls (zoom, fit view, etc.) */}
        <Controls 
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          className="bg-white shadow-lg rounded-lg border border-gray-200"
        />
        
        {/* Minimap */}
        <MiniMap 
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return '#4caf50'
              case 'end': return '#f44336'
              case 'task': return '#2196f3'
              case 'gateway': return '#ff9800'
              default: return '#9e9e9e'
            }
          }}
          className="bg-white shadow-lg rounded-lg border border-gray-200"
          pannable
          zoomable
        />

        {/* Top Toolbar */}
        <Panel position="top-left" className="bg-white shadow-lg rounded-lg border border-gray-200 p-2">
          <div className="flex items-center gap-2">
            <Toolbar
              onSave={handleSave}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
              onDelete={deleteNode}
              onGroup={createGroup}
              onUngroup={ungroupSelected}
              hasSelectedNode={!!selectedNode}
              selectedNodeCount={selectedNodeCount}
              isGroupSelected={selectedNode?.type === 'group'}
            />
          </div>
        </Panel>

        {/* Selection Info Panel */}
        {(selectedNode || selectedEdge) && (
          <Panel position="top-right" className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 w-80">
            {selectedNode && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Heading3 className="text-gray-900">Node Properties</Heading3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={deleteNode}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Body className="text-gray-600 text-sm">ID:</Body>
                    <Body className="text-gray-900 font-mono text-xs">{selectedNode.id}</Body>
                  </div>
                  <div>
                    <Body className="text-gray-600 text-sm">Type:</Body>
                    <Body className="text-gray-900">{selectedNode.type || 'default'}</Body>
                  </div>
                  <div>
                    <Body className="text-gray-600 text-sm">Label:</Body>
                    <Body className="text-gray-900">
                      {selectedNode.data?.label ? String(selectedNode.data.label) : '-'}
                    </Body>
                  </div>
                  <div>
                    <Body className="text-gray-600 text-sm">Position:</Body>
                    <Body className="text-gray-900 font-mono text-xs">
                      x: {Math.round(selectedNode.position.x)}, y: {Math.round(selectedNode.position.y)}
                    </Body>
                  </div>
                </div>
              </div>
            )}
            
            {selectedEdge && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Heading3 className="text-gray-900">Edge Properties</Heading3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={deleteEdge}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Body className="text-gray-600 text-sm">ID:</Body>
                    <Body className="text-gray-900 font-mono text-xs">{selectedEdge.id}</Body>
                  </div>
                  <div>
                    <Body className="text-gray-600 text-sm">From:</Body>
                    <Body className="text-gray-900 font-mono text-xs">{selectedEdge.source}</Body>
                  </div>
                  <div>
                    <Body className="text-gray-600 text-sm">To:</Body>
                    <Body className="text-gray-900 font-mono text-xs">{selectedEdge.target}</Body>
                  </div>
                  {selectedEdge.label && (
                    <div>
                      <Body className="text-gray-600 text-sm">Label:</Body>
                      <Body className="text-gray-900">{selectedEdge.label as string}</Body>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Panel>
        )}

        {/* Stats Panel */}
        <Panel position="bottom-left" className="bg-white shadow-lg rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-4 text-sm">
            <Body className="text-gray-600">Nodes: <span className="font-semibold text-gray-900">{nodes.length}</span></Body>
            <Body className="text-gray-600">Edges: <span className="font-semibold text-gray-900">{edges.length}</span></Body>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
