/**
 * ProcedureFlowDiagram Component
 * ReactFlow editor for Procedure (level 3)
 * Supports all BPMN elements
 */

import { useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { Palette } from '../../../components/FlowBuilder/Palette';
import { PropertiesPanel } from '../../../components/FlowBuilder/PropertiesPanel';
import { Toolbar } from '../../../components/FlowBuilder/Toolbar';
import { ContextMenu } from '../../../components/FlowBuilder/ContextMenu';
import { nodeTypes } from '../../../components/FlowBuilder/nodeTypes';
import { useProcedureFlowStore } from '../hooks/useProcedureFlowStore';
import { useProcedureFlowStore as useStore } from '../store/procedureFlowStore';
import { PaletteConfigFactory } from '../../process-map/config/palette-config';
import { useSwimlanes } from '../hooks/useSwimlanes';
import { findLaneAtPosition, calculateRelativePositionInLane } from '../utils/lanePosition';
import { ImageExtractionModal } from './ImageExtractionModal';
import { useQueryClient } from '@tanstack/react-query';
import { procedureFlowKeys } from '../hooks/useProcedureFlow';

interface ProcedureFlowDiagramProps {
  procedureId: string;
  readOnly?: boolean;
  onNodeSelect?: (node: Node | null) => void;
  onEdgeSelect?: (edge: Edge | null) => void;
}

export function ProcedureFlowDiagram({
  procedureId,
  readOnly = false,
  onNodeSelect,
  onEdgeSelect,
}: ProcedureFlowDiagramProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const queryClient = useQueryClient();
  const [isImageExtractionModalOpen, setIsImageExtractionModalOpen] = useState(false);

  // Get palette configuration for Procedure (level 3)
  const paletteConfig = PaletteConfigFactory.createByEntityType('procedure');

  // Use Zustand store for flow state
  const {
    nodes,
    edges,
    selectedNode,
    selectedEdge,
    isLoading,
    isSaving,
    addNode,
    updateNode,
    deleteNodes,
    deleteEdges,
    updateEdge,
    setSelectedNodes,
    setSelectedEdges,
    clearSelection,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveFlow,
    setNodes,
    addLaneToPool,
    removeLaneFromPool,
    updateLaneSize,
    updateLaneLabel,
    toggleLaneCollapsed,
    togglePoolOrientation,
    updatePoolLabel,
  } = useProcedureFlowStore(procedureId);

  // Create a wrapper for setNodes that supports both direct array and function updates
  // This is needed for compatibility with useSwimlanes which uses functional updates
  const setNodesWrapper = useCallback(
    (nodesOrUpdater: Node[] | ((nodes: Node[]) => Node[])) => {
      if (typeof nodesOrUpdater === 'function') {
        const currentNodes = useStore.getState().nodes;
        const updatedNodes = nodesOrUpdater(currentNodes);
        setNodes(updatedNodes);
      } else {
        setNodes(nodesOrUpdater);
      }
    },
    [setNodes],
  );

  // Swimlanes management - pass store actions for optimal performance
  const {
    pools,
    createPool,
    createLane,
    deleteLane,
    assignNodeToLane,
    autoResizeLane,
    changePoolOrientation,
    toggleLaneCollapsed: toggleLaneCollapsedHook,
  } = useSwimlanes({
    nodes,
    setNodes: setNodesWrapper,
    readOnly,
    addLaneToPool,
    removeLaneFromPool,
    updateLaneSize,
    updateLaneLabel,
    toggleLaneCollapsed,
    togglePoolOrientation,
    updatePoolLabel,
  });

  // Update pool nodes with callbacks for SwimlaneNode component
  const updatePoolCallbacks = useCallback(() => {
    const pools = nodes.filter((n) => n.type === 'pool' || n.type === 'swimlane');
    pools.forEach((pool) => {
      const poolData = pool.data as any;
      if (!poolData.onLabelChange || !poolData.onToggleOrientation) {
        updateNode(pool.id, {
          data: {
            ...poolData,
            onLabelChange: (label: string) => {
              updatePoolLabel(pool.id, label);
            },
            onToggleOrientation: () => {
              togglePoolOrientation(pool.id);
            },
            onAddLane: () => {
              addLaneToPool(pool.id);
            },
            onRemoveLane: (poolId: string, laneId: string) => {
              removeLaneFromPool(poolId, laneId);
            },
            onLaneResize: (poolId: string, laneId: string, size: number) => {
              updateLaneSize(poolId, laneId, size);
            },
            onLaneLabelChange: (poolId: string, laneId: string, label: string) => {
              updateLaneLabel(poolId, laneId, label);
            },
          },
        });
      }
    });
  }, [nodes, updateNode, updatePoolLabel, togglePoolOrientation, addLaneToPool, removeLaneFromPool, updateLaneSize, updateLaneLabel]);

  // Update callbacks when nodes change
  useEffect(() => {
    updatePoolCallbacks();
  }, [nodes.length, updatePoolCallbacks]);

  // Drag and drop from palette
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      if (readOnly) return;
      
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      // Check if node type is allowed for this level
      if (!paletteConfig.getAllowedNodeTypes().includes(nodeType)) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: `Nouveau ${nodeType}`,
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode, readOnly, paletteConfig],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      if (readOnly) return;
      
      // Handle pool deletion - lanes are in data.lanes, so no separate lane nodes to delete
      // Just delete the pool nodes
      
      const deletedIds = deleted.map((n) => n.id);
      deleteNodes(deletedIds);
    },
    [deleteNodes, readOnly, deleteLane],
  );

  const onEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      if (readOnly) return;
      const deletedIds = deleted.map((e) => e.id);
      deleteEdges(deletedIds);
    },
    [deleteEdges, readOnly],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodes([node.id]);
      setSelectedEdges([]);
      onNodeSelect?.(node);
      
      // Handle pool orientation change
      if (node.type === 'pool' && node.data?.onOrientationChange) {
        const currentOrientation = node.data?.orientation || 'vertical';
        const newOrientation = currentOrientation === 'vertical' ? 'horizontal' : 'vertical';
        changePoolOrientation(node.id, newOrientation);
      }
    },
    [setSelectedNodes, setSelectedEdges, onNodeSelect, changePoolOrientation],
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdges([edge.id]);
      setSelectedNodes([]);
      onEdgeSelect?.(edge);
    },
    [setSelectedEdges, setSelectedNodes, onEdgeSelect],
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
    onNodeSelect?.(null);
    onEdgeSelect?.(null);
  }, [clearSelection, onNodeSelect, onEdgeSelect]);

  const handleSave = useCallback(async () => {
    if (readOnly) return;
    try {
      await saveFlow();
    } catch (error) {
      // Error handling is done in the mutation
    }
  }, [saveFlow, readOnly]);

  // Handle node drag stop - attach/detach from lanes
  // Lanes are now stored in pool.data.lanes, so we calculate positions from pool
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Auto-detect if node is dropped in a lane
      if (readOnly) return;

      // Skip pools (swimlanes)
      if (node.type === 'pool' || node.type === 'swimlane') {
        return;
      }

      // Get the node's absolute position
      // If node has a parent, calculate absolute position by adding parent position
      const nodeAbsolutePosition = (node as any).parentId || (node as any).parentNode
        ? (() => {
            const parentId = (node as any).parentId || (node as any).parentNode;
            const parent = nodes.find((n) => n.id === parentId);
            return parent
              ? {
                  x: ((parent.position?.x as number) || 0) + node.position.x,
                  y: ((parent.position?.y as number) || 0) + node.position.y,
                }
              : node.position;
          })()
        : node.position;

      // Find if node is now inside a lane (lanes are in pool.data.lanes)
      // Use utility function for accurate lane detection
      const pools = nodes.filter((n) => (n.type === 'pool' || n.type === 'swimlane') && n.data?.lanes);
      let newParentPool: Node | null = null;
      let newLaneId: string | null = null;
      let newLaneBounds: { x: number; y: number; width: number; height: number } | null = null;

      for (const pool of pools) {
        const laneResult = findLaneAtPosition(
          pool,
          nodeAbsolutePosition.x,
          nodeAbsolutePosition.y,
        );

        if (laneResult) {
          newParentPool = pool;
          newLaneId = laneResult.laneId;
          newLaneBounds = laneResult.laneBounds;
          break;
        }
      }

      const currentParentId = (node as any).parentId || (node as any).parentNode;
      const currentLaneId = node.data?.laneId;
      const newParentId = newParentPool?.id;

      // Only update if parent or lane changed
      if (currentParentId !== newParentId || currentLaneId !== newLaneId) {
        const updatedNodes = nodes.map((n) => {
          if (n.id === node.id) {
            if (newParentPool && newLaneId && newLaneBounds) {
              // Moving into a lane - attach to pool as parent
              // Calculate relative position within the lane using utility function
              const relativePos = calculateRelativePositionInLane(
                nodeAbsolutePosition.x,
                nodeAbsolutePosition.y,
                newLaneBounds,
              );

              return {
                ...n,
                position: {
                  x: relativePos.x,
                  y: relativePos.y,
                },
                // parentId and extent at the same level as data, type, position
                ...({ parentId: newParentPool.id, extent: 'parent' } as any),
                // Also keep parentNode for ReactFlow compatibility
                ...({ parentNode: newParentPool.id } as any),
                data: {
                  ...n.data,
                  parentNodeId: newParentPool.id, // Keep in data for persistence
                  laneId: newLaneId, // Store which lane the node is in
                  poolId: newParentPool.id,
                },
              };
            } else {
              // Moving out of a lane
              return {
                ...n,
                position: nodeAbsolutePosition,
                // Remove parentId and extent from node level
                ...({ parentId: undefined, extent: undefined } as any),
                ...({ parentNode: undefined } as any),
                data: {
                  ...n.data,
                  parentNodeId: undefined, // Clear from data too
                  laneId: undefined,
                  poolId: undefined,
                },
              };
            }
          }
          return n;
        });

        updateNode(node.id, {
          ...updatedNodes.find((n) => n.id === node.id),
        });
      }
    },
    [nodes, updateNode, readOnly],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex" style={{ height: '100%' }}>
      {/* Left Sidebar - Palette (hidden in readOnly mode) */}
      {!readOnly && (
        <div className="w-72 bg-white border-r-2 border-gray-200 shadow-lg">
          <Palette 
            onDragStart={onDragStart}
            allowedNodeTypes={paletteConfig.getAllowedNodeTypes()}
            customNodes={paletteConfig.getNodeDefinitions()}
            defaultExpandedCategories={paletteConfig.getDefaultExpandedCategories()}
            title={paletteConfig.getTitle()}
          />
        </div>
      )}

      {/* Center - Flow Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onNodeDragStop={onNodeDragStop}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          deleteKeyCode={readOnly ? null : 'Delete'}
          fitView
          className="bg-gray-50"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#ff6900"
            className="bg-gray-50"
          />
          <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            className="bg-white shadow-lg rounded-lg border border-gray-200"
          />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'startEvent') return '#4caf50';
              if (node.type === 'endEvent') return '#f44336';
              if (node.type === 'task' || node.type === 'userTask' || node.type === 'serviceTask') return '#9c27b0';
              if (node.type === 'gateway' || node.type === 'exclusiveGateway') return '#ff9800';
              return '#9e9e9e';
            }}
            className="bg-white shadow-lg rounded-lg border border-gray-200"
            pannable
            zoomable
          />
          
          {/* Context Menu - simplified since lanes are in data.lanes */}
          {!readOnly && (
            <ContextMenu
              onAddLaneAbove={(laneId) => {
                // Find pool containing this lane
                const pool = nodes.find(
                  (n) => (n.type === 'pool' || n.type === 'swimlane') && (n.data as any)?.lanes?.some((l: any) => l.id === laneId),
                );
                if (pool) {
                  createLane(pool.id, {
                    label: `Lane ${((pool.data as any)?.lanes?.length || 0) + 1}`,
                  });
                }
              }}
              onAddLaneBelow={(laneId) => {
                const pool = nodes.find(
                  (n) => (n.type === 'pool' || n.type === 'swimlane') && (n.data as any)?.lanes?.some((l: any) => l.id === laneId),
                );
                if (pool) {
                  createLane(pool.id, {
                    label: `Lane ${((pool.data as any)?.lanes?.length || 0) + 1}`,
                  });
                }
              }}
              onDeleteLane={(laneId) => {
                // Find pool containing this lane
                const pool = nodes.find(
                  (n) => (n.type === 'pool' || n.type === 'swimlane') && (n.data as any)?.lanes?.some((l: any) => l.id === laneId),
                );
                if (pool) {
                  deleteLane(pool.id, laneId);
                }
              }}
              onResizeLane={(laneId) => {
                const pool = nodes.find(
                  (n) => (n.type === 'pool' || n.type === 'swimlane') && (n.data as any)?.lanes?.some((l: any) => l.id === laneId),
                );
                if (pool) {
                  autoResizeLane(pool.id, laneId);
                }
              }}
              onToggleLaneCollapsed={(laneId) => {
                const pool = nodes.find(
                  (n) => (n.type === 'pool' || n.type === 'swimlane') && (n.data as any)?.lanes?.some((l: any) => l.id === laneId),
                );
                if (pool) {
                  toggleLaneCollapsedHook(pool.id, laneId);
                }
              }}
              onChangePoolOrientation={(poolId) => {
                togglePoolOrientation(poolId);
              }}
            />
          )}
          
          {/* Toolbar (hidden in readOnly mode) */}
          {!readOnly && (
            <Panel position="top-left" className="bg-white shadow-lg rounded-lg border border-gray-200 p-2 z-50 !left-4 !top-4">
              <Toolbar
                onSave={handleSave}
                isSaving={isSaving}
                saveError={null}
                onFitView={() => reactFlowInstance?.fitView()}
                onZoomIn={() => reactFlowInstance?.zoomIn()}
                onZoomOut={() => reactFlowInstance?.zoomOut()}
                onDelete={() => {
                  if (selectedNode) {
                    deleteNodes([selectedNode.id]);
                  }
                  if (selectedEdge) {
                    deleteEdges([selectedEdge.id]);
                  }
                }}
                hasSelectedNode={!!selectedNode || !!selectedEdge}
                selectedNodeCount={(selectedNode ? 1 : 0) + (selectedEdge ? 1 : 0)}
                onAddPool={() => {
                  if (reactFlowInstance) {
                    const center = reactFlowInstance.screenToFlowPosition({
                      x: window.innerWidth / 2,
                      y: window.innerHeight / 2,
                    });
                    createPool(center);
                  } else {
                    createPool();
                  }
                }}
                onAddLane={() => {
                  if (pools.length > 0) {
                    const firstPool = pools[0];
                    createLane(firstPool.id);
                  }
                }}
                hasPool={pools.length > 0}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Right Sidebar - Properties Panel (hidden in readOnly mode) */}
      {!readOnly && (
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <PropertiesPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            lanes={nodes.filter((n) => n.type === 'lane')}
            onAssignNodeToLane={assignNodeToLane}
            onNodeUpdate={(nodeId, data) => {
              updateNode(nodeId, { data });
            }}
            onEdgeUpdate={(edgeId, data) => {
              updateEdge(edgeId, data);
            }}
          />
        </div>
      )}

      {/* Image Extraction Modal */}
      {!readOnly && (
        <ImageExtractionModal
          open={isImageExtractionModalOpen}
          onOpenChange={setIsImageExtractionModalOpen}
          procedureId={procedureId}
          existingNodesCount={nodes.length}
          onSuccess={async () => {
            // Invalidate and refetch flow data to get the new nodes
            await queryClient.invalidateQueries({
              queryKey: procedureFlowKeys.detail(procedureId),
            });
            setIsImageExtractionModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

