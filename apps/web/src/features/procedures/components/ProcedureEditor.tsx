import { useCallback, useRef, useState, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button } from '@repo/ui/components/ui/button'
import { BodySmall } from '@repo/ui'
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { CreateDiagramEdgeDto } from '../types/procedure.types'
import { NodePalette } from './NodePalette'
import { LanePanel } from './LanePanel'
import { PropertiesPanel } from './PropertiesPanel'
import { ValidationPanel } from './ValidationPanel'
import type {
  DiagramNode,
  DiagramEdge,
  DiagramLane,
  QualigramNodeType,
} from '../types/procedure.types'
import {
  useCreateNode,
  useUpdateNode,
  useDeleteNode,
  useCreateEdge,
  useUpdateEdge,
  useDeleteEdge,
  useProcedureValidation,
} from '../hooks/useProcedures'
import {
  useCreateDiagramNode,
  useUpdateDiagramNode,
  useDeleteDiagramNode,
  useCreateDiagramEdge,
  useUpdateDiagramEdge,
  useDeleteDiagramEdge,
  useCreateDiagramLane,
  useUpdateDiagramLane,
  useDeleteDiagramLane,
} from '../../qualigram/hooks/useDiagramElements'

interface ProcedureEditorProps {
  level?: 'macro-process' | 'process' | 'procedure'
  levelId?: string
  procedureId?: string  // Kept for backward compatibility
  initialNodes?: DiagramNode[]
  initialEdges?: DiagramEdge[]
  initialLanes?: DiagramLane[]
  onSave?: () => void
  onNodeSelect?: (node: Node | null) => void
  onEdgeSelect?: (edge: Edge | null) => void
}

// Convert DiagramNode to ReactFlow Node
function diagramNodeToReactFlowNode(
  node: DiagramNode,
  lanes: DiagramLane[] = [],
): Node {
  // Find lane by laneId (frontend identifier) or by id (database id)
  const lane = lanes.find((l) => l.laneId === node.laneId || l.id === node.laneId)
  
  return {
    id: node.nodeId,
    type: mapNodeTypeToReactFlowType(node.type),
    position: { x: node.positionX, y: node.positionY },
    data: {
      label: node.label,
      description: node.description,
      type: node.type,
      responsible: node.responsible,
      accountable: node.accountable,
      consulted: node.consulted,
      informed: node.informed,
      duration: node.duration,
      ...node.data,
    },
    style: {
      width: node.width || 120,
      height: node.height || 60,
      ...node.style,
    },
    parentId: lane?.laneId,
  }
}

// Convert DiagramEdge to ReactFlow Edge
function diagramEdgeToReactFlowEdge(
  edge: DiagramEdge,
  nodes: DiagramNode[],
): Edge {
  const sourceNode = nodes.find((n) => n.id === edge.sourceId)
  const targetNode = nodes.find((n) => n.id === edge.targetId)

  return {
    id: edge.edgeId,
    source: sourceNode?.nodeId || '',
    target: targetNode?.nodeId || '',
    label: edge.label,
    type: 'smoothstep',
    animated: edge.animated,
    data: {
      type: edge.type,
      condition: edge.condition,
      ...edge.data,
    },
    style: edge.style,
  }
}

// Map Qualigram node type to ReactFlow node type
function mapNodeTypeToReactFlowType(type: QualigramNodeType): string {
  const typeMap: Record<QualigramNodeType, string> = {
    START: 'input',
    END: 'output',
    ACTIVITY: 'default',
    DECISION: 'default',
    SUBPROCESS: 'default',
    DOCUMENT: 'default',
    COMMENT: 'default',
    CONNECTOR: 'default',
    GATEWAY_AND: 'default',
    GATEWAY_OR: 'default',
    GATEWAY_XOR: 'default',
    EVENT_TIMER: 'default',
    EVENT_MESSAGE: 'default',
  }
  return typeMap[type] || 'default'
}

export function ProcedureEditor({
  level = 'procedure',
  levelId,
  procedureId,
  initialNodes = [],
  initialEdges = [],
  initialLanes = [],
  onSave,
  onNodeSelect,
  onEdgeSelect,
}: ProcedureEditorProps) {
  // Use levelId if provided, otherwise fallback to procedureId for backward compatibility
  const currentLevelId = levelId || procedureId || ''
  const currentLevel: 'macro-process' | 'process' | 'procedure' = 
    level || (procedureId ? 'procedure' : 'procedure')
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Convert initial data to ReactFlow format
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map((n) => diagramNodeToReactFlowNode(n, initialLanes)),
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map((e) => diagramEdgeToReactFlowEdge(e, initialNodes)),
  )

  // Use appropriate hooks based on level
  const isProcedureLevel = currentLevel === 'procedure' && procedureId
  
  // Mutations - use generic hooks for all levels, fallback to procedure-specific for backward compatibility
  const createDiagramNodeMutation = useCreateDiagramNode()
  const updateDiagramNodeMutation = useUpdateDiagramNode()
  const deleteDiagramNodeMutation = useDeleteDiagramNode()
  const createDiagramEdgeMutation = useCreateDiagramEdge()
  const updateDiagramEdgeMutation = useUpdateDiagramEdge()
  const deleteDiagramEdgeMutation = useDeleteDiagramEdge()
  
  // Procedure-specific mutations (for backward compatibility)
  const createNodeMutation = useCreateNode()
  const updateNodeMutation = useUpdateNode()
  const deleteNodeMutation = useDeleteNode()
  const createEdgeMutation = useCreateEdge()
  const updateEdgeMutation = useUpdateEdge()
  const deleteEdgeMutation = useDeleteEdge()

  // Validation (only for procedure level)
  const { data: validationResult } = useProcedureValidation(
    isProcedureLevel ? procedureId : undefined
  )

  // Update nodes/edges when initial data changes
  useEffect(() => {
    if (initialNodes.length > 0 || initialEdges.length > 0) {
      setNodes(
        initialNodes.map((n) => diagramNodeToReactFlowNode(n, initialLanes)),
      )
      setEdges(
        initialEdges.map((e) => diagramEdgeToReactFlowEdge(e, initialNodes)),
      )
    }
  }, [initialNodes, initialEdges, initialLanes, setNodes, setEdges])

  // Handle connection
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return

      const sourceNode = nodes.find((n) => n.id === params.source)
      const targetNode = nodes.find((n) => n.id === params.target)

      if (!sourceNode || !targetNode) return

      // Find the database IDs
      const sourceDiagramNode = initialNodes.find(
        (n) => n.nodeId === params.source,
      )
      const targetDiagramNode = initialNodes.find(
        (n) => n.nodeId === params.target,
      )

      if (sourceDiagramNode && targetDiagramNode) {
        const edgeData: any = {
          edgeId: `edge_${Date.now()}`,
          sourceId: sourceDiagramNode.nodeId,
          targetId: targetDiagramNode.nodeId,
          type: 'SEQUENCE',
        }

        if (currentLevel === 'macro-process' && currentLevelId) {
          edgeData.macroProcessId = currentLevelId
          createDiagramEdgeMutation.mutate({
            level: 'macro-process',
            levelId: currentLevelId,
            data: edgeData,
          })
        } else if (currentLevel === 'process' && currentLevelId) {
          edgeData.processId = currentLevelId
          createDiagramEdgeMutation.mutate({
            level: 'process',
            levelId: currentLevelId,
            data: edgeData,
          })
        } else if (currentLevel === 'procedure' && procedureId) {
          createEdgeMutation.mutate({
            procedureId,
            data: edgeData,
          })
        }
      }

      setEdges((eds) => addEdge(params, eds))
    },
    [
      nodes,
      initialNodes,
      currentLevel,
      currentLevelId,
      procedureId,
      createDiagramEdgeMutation,
      createEdgeMutation,
      setEdges,
    ],
  )

  // Handle node click
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setSelectedEdge(null)
    onNodeSelect?.(node)
    onEdgeSelect?.(null)
  }, [onNodeSelect, onEdgeSelect])

  // Handle edge click
  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
    onEdgeSelect?.(edge)
    onNodeSelect?.(null)
  }, [onEdgeSelect, onNodeSelect])

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    onNodeSelect?.(null)
    onEdgeSelect?.(null)
  }, [onNodeSelect, onEdgeSelect])

  // Handle drag and drop from palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const nodeType = event.dataTransfer.getData(
        'application/reactflow',
      ) as QualigramNodeType

      if (!nodeType || !reactFlowInstance) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const nodeId = `node_${Date.now()}`
      const newNode: Node = {
        id: nodeId,
        type: mapNodeTypeToReactFlowType(nodeType),
        position,
        data: {
          label: getNodeTypeLabel(nodeType),
          type: nodeType,
        },
      }

      // Create node in database - use appropriate hook based on level
      const nodeData: any = {
        nodeId,
        type: nodeType,
        label: getNodeTypeLabel(nodeType),
        positionX: position.x,
        positionY: position.y,
      }

      // Add level-specific ID
      if (currentLevel === 'macro-process' && currentLevelId) {
        nodeData.macroProcessId = currentLevelId
        createDiagramNodeMutation.mutate({
          level: 'macro-process',
          levelId: currentLevelId,
          data: nodeData,
        })
      } else if (currentLevel === 'process' && currentLevelId) {
        nodeData.processId = currentLevelId
        createDiagramNodeMutation.mutate({
          level: 'process',
          levelId: currentLevelId,
          data: nodeData,
        })
      } else if (currentLevel === 'procedure' && procedureId) {
        // Use procedure-specific hook for backward compatibility
        createNodeMutation.mutate({
          procedureId,
          data: nodeData,
        })
      }

      setNodes((nds) => [...nds, newNode])
    },
    [
      reactFlowInstance,
      currentLevel,
      currentLevelId,
      procedureId,
      createDiagramNodeMutation,
      createNodeMutation,
      setNodes,
    ],
  )

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // Save all nodes and edges
      const nodePromises = nodes.map((node) => {
        const diagramNode = initialNodes.find((n) => n.nodeId === node.id)
        if (diagramNode) {
          return updateNodeMutation.mutateAsync({
            procedureId,
            nodeId: node.id,
            data: {
              positionX: node.position.x,
              positionY: node.position.y,
              label: typeof node.data?.label === 'string' ? node.data.label : '',
              description: typeof node.data?.description === 'string' ? node.data.description : undefined,
              width: node.width,
              height: node.height,
            },
          })
        }
        return Promise.resolve()
      })

      const edgePromises = edges.map((edge) => {
        const diagramEdge = initialEdges.find((e) => e.edgeId === edge.id)
        if (diagramEdge) {
          return updateEdgeMutation.mutateAsync({
            procedureId,
            edgeId: edge.id,
            data: {
              label: edge.label,
              condition: typeof edge.data?.condition === 'string' ? edge.data.condition : undefined,
              animated: edge.animated,
              type: (edge.data as any)?.type || 'SEQUENCE',
            } as Partial<CreateDiagramEdgeDto>,
          })
        }
        return Promise.resolve()
      })

      await Promise.all([...nodePromises, ...edgePromises])
      setLastSaved(new Date())
      onSave?.()
    } finally {
      setIsSaving(false)
    }
  }, [
    nodes,
    edges,
    initialNodes,
    initialEdges,
    currentLevel,
    currentLevelId,
    procedureId,
    updateDiagramNodeMutation,
    updateDiagramEdgeMutation,
    updateNodeMutation,
    updateEdgeMutation,
    onSave,
  ])

  // Handle delete
  const handleDelete = useCallback(() => {
    if (selectedNode) {
      if (currentLevel === 'macro-process' && currentLevelId) {
        deleteDiagramNodeMutation.mutate({
          level: 'macro-process',
          levelId: currentLevelId,
          nodeId: selectedNode.id,
        })
      } else if (currentLevel === 'process' && currentLevelId) {
        deleteDiagramNodeMutation.mutate({
          level: 'process',
          levelId: currentLevelId,
          nodeId: selectedNode.id,
        })
      } else if (currentLevel === 'procedure' && procedureId) {
        deleteNodeMutation.mutate({
          procedureId,
          nodeId: selectedNode.id,
        })
      }
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setSelectedNode(null)
    } else if (selectedEdge) {
      if (currentLevel === 'macro-process' && currentLevelId) {
        deleteDiagramEdgeMutation.mutate({
          level: 'macro-process',
          levelId: currentLevelId,
          edgeId: selectedEdge.id,
        })
      } else if (currentLevel === 'process' && currentLevelId) {
        deleteDiagramEdgeMutation.mutate({
          level: 'process',
          levelId: currentLevelId,
          edgeId: selectedEdge.id,
        })
      } else if (currentLevel === 'procedure' && procedureId) {
        deleteEdgeMutation.mutate({
          procedureId,
          edgeId: selectedEdge.id,
        })
      }
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id))
      setSelectedEdge(null)
    }
  }, [
    selectedNode,
    selectedEdge,
    currentLevel,
    currentLevelId,
    procedureId,
    deleteDiagramNodeMutation,
    deleteDiagramEdgeMutation,
    deleteNodeMutation,
    deleteEdgeMutation,
    setNodes,
    setEdges,
  ])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNode || selectedEdge) {
          handleDelete()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, selectedEdge, handleDelete])

  return (
    <div className="flex h-full">
      {/* Node Palette */}
      <NodePalette
        onNodeTypeSelect={(type) => {
          // Handle quick add
          if (reactFlowInstance) {
            const position = reactFlowInstance.getViewport()
            const nodeId = `node_${Date.now()}`
            const newNode: Node = {
              id: nodeId,
              type: mapNodeTypeToReactFlowType(type),
              position: { x: position.x + 200, y: position.y + 200 },
              data: {
                label: getNodeTypeLabel(type),
                type: type,
              } as any,
            }
            createNodeMutation.mutate({
              procedureId,
              data: {
                nodeId,
                type: type,
                label: getNodeTypeLabel(type),
                positionX: newNode.position.x,
                positionY: newNode.position.y,
              },
            })
            setNodes((nds) => [...nds, newNode])
          }
        }}
      />

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSaving && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md shadow-sm border border-gray-200">
                <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                <BodySmall className="text-xs text-gray-600">Sauvegarde...</BodySmall>
              </div>
            )}
            {lastSaved && !isSaving && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md shadow-sm border border-gray-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <BodySmall className="text-xs text-gray-500">
                  Sauvegardé {lastSaved.toLocaleTimeString()}
                </BodySmall>
              </div>
            )}
            <Button
              onClick={handleSave}
              className="bg-orange-600 hover:bg-orange-700"
              size="sm"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
            <Button
              onClick={() => setShowValidation(!showValidation)}
              variant="outline"
              size="sm"
            >
              {validationResult?.isValid ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
              )}
              Validation
            </Button>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div
          ref={reactFlowWrapper}
          className="flex-1"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            fitView
            attributionPosition="bottom-right"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#ff6900"
            />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
      const type = (node.data as any)?.type
      if (type === 'START') return '#4caf50'
      if (type === 'END') return '#f44336'
      if (type === 'ACTIVITY') return '#2196f3'
      if (typeof type === 'string' && type.includes('GATEWAY')) return '#ff9800'
      return '#9e9e9e'
              }}
            />
          </ReactFlow>
        </div>
      </div>

      {/* Side Panels */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Lane Panel */}
        <LanePanel
          procedureId={procedureId}
          lanes={initialLanes}
          onLaneChange={() => {
            // Refresh lanes
          }}
        />

        {/* Properties Panel */}
        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeUpdate={(nodeId, data) => {
            if (currentLevel === 'macro-process' && currentLevelId) {
              updateDiagramNodeMutation.mutate({
                level: 'macro-process',
                levelId: currentLevelId,
                nodeId,
                data,
              })
            } else if (currentLevel === 'process' && currentLevelId) {
              updateDiagramNodeMutation.mutate({
                level: 'process',
                levelId: currentLevelId,
                nodeId,
                data,
              })
            } else if (currentLevel === 'procedure' && procedureId) {
              updateNodeMutation.mutate({
                procedureId,
                nodeId,
                data,
              })
            }
            setNodes((nds) =>
              nds.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
              ),
            )
          }}
          onEdgeUpdate={(edgeId, data) => {
            if (currentLevel === 'macro-process' && currentLevelId) {
              updateDiagramEdgeMutation.mutate({
                level: 'macro-process',
                levelId: currentLevelId,
                edgeId,
                data,
              })
            } else if (currentLevel === 'process' && currentLevelId) {
              updateDiagramEdgeMutation.mutate({
                level: 'process',
                levelId: currentLevelId,
                edgeId,
                data,
              })
            } else if (currentLevel === 'procedure' && procedureId) {
              updateEdgeMutation.mutate({
                procedureId,
                edgeId,
                data,
              })
            }
            setEdges((eds) =>
              eds.map((e) =>
                e.id === edgeId ? { ...e, ...data } : e,
              ),
            )
          }}
        />

        {/* Validation Panel */}
        {showValidation && validationResult && (
          <ValidationPanel validationResult={validationResult} />
        )}
      </div>
    </div>
  )
}

// Helper function to get node type label
function getNodeTypeLabel(type: QualigramNodeType): string {
  const labels: Record<QualigramNodeType, string> = {
    START: 'Début',
    END: 'Fin',
    ACTIVITY: 'Activité',
    DECISION: 'Décision',
    SUBPROCESS: 'Sous-processus',
    DOCUMENT: 'Document',
    COMMENT: 'Commentaire',
    CONNECTOR: 'Connecteur',
    GATEWAY_AND: 'Porte ET',
    GATEWAY_OR: 'Porte OU',
    GATEWAY_XOR: 'Porte OU Exclusif',
    EVENT_TIMER: 'Événement Timer',
    EVENT_MESSAGE: 'Événement Message',
  }
  return labels[type] || 'Nœud'
}

