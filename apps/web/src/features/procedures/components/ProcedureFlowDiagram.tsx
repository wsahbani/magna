/**
 * ProcedureFlowDiagram Component
 * ReactFlow editor for Procedure (level 3)
 * Supports all BPMN elements
 */

import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
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
import { useNavigate } from '@tanstack/react-router';
import { Palette } from '../../../components/FlowBuilder/Palette';
import { PropertiesPanel } from '../../../components/FlowBuilder/PropertiesPanel';
import { Toolbar } from '../../../components/FlowBuilder/Toolbar';
import { ContextMenu } from '../../../components/FlowBuilder/ContextMenu';
import { nodeTypes } from '../../../components/FlowBuilder/nodeTypes';
import { useProcedureFlowStore } from '../hooks/useProcedureFlowStore';
import { useProcedureFlowStore as useStore } from '../store/procedureFlowStore';
import { PaletteConfigFactory } from '../../process-map/config/palette-config';
import { useSwimlanes } from '../hooks/useSwimlanes';
import { 
  findLaneAtPosition, 
  calculateRelativePositionInLane,
  calculateLanePosition,
  isNodeInLaneBounds,
  constrainNodeToLane,
} from '../utils/lanePosition';
import { ImageExtractionModal } from './ImageExtractionModal';
import { useQueryClient } from '@tanstack/react-query';
import { procedureFlowKeys } from '../hooks/useProcedureFlow';
import type { FlowNode, Position, createNodeWithParent, removeNodeParent } from '../types/flow-node.types';
import { isPoolNode } from '../types/flow-node.types';
import { getBackgroundVariant } from '../../../components/FlowBuilder/utils/gridUtils';
import { exportFlowToImage } from '../../../components/FlowBuilder/utils/exportFlowImage';

// Constants
const BACKGROUND_GAP = 20;
const BACKGROUND_SIZE = 1;
const BACKGROUND_COLOR = '#ff6900';
const PALETTE_WIDTH = 'w-72';
const PROPERTIES_PANEL_WIDTH = 'w-80';

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
  const navigate = useNavigate();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const queryClient = useQueryClient();
  const [isImageExtractionModalOpen, setIsImageExtractionModalOpen] = useState(false);
  const [gridSettings, setGridSettings] = useState<{ snapToGrid: boolean; gridSize: number; showGrid: boolean; backgroundPattern: 'dots' | 'lines' | 'cross' | 'none' }>({ snapToGrid: false, gridSize: 15, showGrid: true, backgroundPattern: 'dots' });
  const [showHelperLines, setShowHelperLines] = useState(true);
  const [hoveredLaneId, setHoveredLaneId] = useState<string | null>(null);

  // Get palette configuration for Procedure (level 3) - memoized
  const paletteConfig = useMemo(
    () => PaletteConfigFactory.createByEntityType('procedure'),
    []
  );

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
    flowDirection,
    setFlowDirection,
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

  // Memoize pool nodes for performance
  const poolNodes = useMemo(
    () => nodes.filter((n) => (n.type === 'pool' || n.type === 'swimlane') && n.data?.lanes),
    [nodes]
  );

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

  // Helper function to check if a node is a container
  const isContainerNode = useCallback((nodeType: string | undefined): boolean => {
    // Pools and swimlanes are container nodes at level 3
    return nodeType === 'pool' || nodeType === 'swimlane';
  }, []);

  // Handle node style update
  const handleNodeStyleUpdate = useCallback((nodeId: string, data: Partial<Node['data']>) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Merge style properly if it exists in data (same as PropertiesPanel)
    const updatedData = { ...node.data, ...data };
    if (data.style && node.data?.style) {
      updatedData.style = { ...node.data.style, ...data.style };
    } else if (data.style) {
      updatedData.style = data.style;
    }
    
    updateNode(nodeId, {
      data: updatedData,
    } as any);
  }, [nodes, updateNode]);

  // Handle attaching a node to a container (pool/swimlane)
  const handleAttachNode = useCallback((nodeId: string, containerId: string) => {
    if (readOnly) return;
    
    const node = nodes.find((n) => n.id === nodeId);
    const container = nodes.find((n) => n.id === containerId);
    if (!node || !container) return;

    // Calculate absolute position of the node
    let absolutePosition = node.position;
    if (node.parentId) {
      const currentParent = nodes.find((n) => n.id === node.parentId);
      if (currentParent) {
        absolutePosition = {
          x: node.position.x + currentParent.position.x,
          y: node.position.y + currentParent.position.y,
        };
      }
    }

    // Calculate relative position within container
    const relativePosition = {
      x: absolutePosition.x - container.position.x,
      y: absolutePosition.y - container.position.y,
    };

    // Find which lane the node should be attached to (if any)
    const poolData = container.data as any;
    const lanes = poolData?.lanes || [];
    
    // Try to find the lane at the absolute position
    let targetLaneId: string | undefined;
    let targetLaneBounds: { x: number; y: number; width: number; height: number } | null = null;
    
    if (lanes.length > 0) {
      const laneResult = findLaneAtPosition(
        container,
        absolutePosition.x,
        absolutePosition.y,
      );
      
      if (laneResult) {
        targetLaneId = laneResult.laneId;
        targetLaneBounds = laneResult.laneBounds;
      } else {
        // Default to first lane if position doesn't match any lane
        targetLaneId = lanes[0]?.id;
        if (targetLaneId) {
          targetLaneBounds = calculateLanePosition(container, targetLaneId);
        }
      }
    }

    // Calculate relative position within the lane (not just the pool)
    let finalRelativePosition = relativePosition;
    if (targetLaneId && targetLaneBounds) {
      const laneRelativePos = calculateRelativePositionInLane(
        absolutePosition.x,
        absolutePosition.y,
        targetLaneBounds,
      );
      finalRelativePosition = laneRelativePos;
    }

    updateNode(nodeId, {
      parentId: containerId,
      position: finalRelativePosition,
      extent: 'parent' as const,
      data: {
        ...node.data,
        parentNodeId: containerId,
        poolId: containerId,
        laneId: targetLaneId,
      },
    } as any);
  }, [nodes, updateNode, readOnly]);

  // Handle detaching a node from its container
  const handleDetachNode = useCallback((nodeId: string) => {
    if (readOnly) return;
    
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !node.parentId) return;

    const parent = nodes.find((n) => n.id === node.parentId);
    if (!parent) return;

    // Convert relative position to absolute
    const absolutePosition = {
      x: node.position.x + parent.position.x,
      y: node.position.y + parent.position.y,
    };

    updateNode(nodeId, {
      parentId: undefined,
      position: absolutePosition,
      extent: undefined,
      data: {
        ...node.data,
        parentNodeId: undefined,
        poolId: undefined,
        laneId: undefined,
      },
    } as any);
  }, [nodes, updateNode, readOnly]);

  // Handle change handle positions
  const handleChangeHandlePosition = useCallback(
    (sourcePos: 'top' | 'right' | 'bottom' | 'left', targetPos: 'top' | 'right' | 'bottom' | 'left') => {
      if (!selectedNode) return;
      
      updateNode(selectedNode.id, {
        data: {
          ...selectedNode.data,
          handlePositions: {
            source: sourcePos,
            target: targetPos,
          },
        },
      });
    },
    [selectedNode, updateNode],
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // FIRST: Check for linked process navigation (works in readOnly mode)
      const linkedProcessId = node.data?.linkedProcessId;
      const linkedProcessType = node.data?.linkedProcessType;
      const linkedProcessFlowType = node.data?.linkedProcessFlowType;
      
      // Navigate if linked and in read-only mode, or if Ctrl/Cmd is pressed
      if (linkedProcessId && (readOnly || _event.ctrlKey || _event.metaKey)) {
        if (linkedProcessType === 'processMap') {
          navigate({ to: '/process-maps/$id' as any, params: { id: linkedProcessId } as any });
        } else if (linkedProcessType === 'process') {
          // Navigate based on flow type
          if (linkedProcessFlowType === 'SIPOC') {
            window.location.href = `/processes/sipoc/${linkedProcessId}`;
          } else {
            navigate({ to: '/processes-level2/$id' as any, params: { id: linkedProcessId } as any });
          }
        } else if (linkedProcessType === 'procedure') {
          navigate({ to: '/procedures-level3/$id' as any, params: { id: linkedProcessId } as any });
        }
        return;
      }
      
      // If readOnly and no linked process, don't allow editing
      if (readOnly) return;
      
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
    [setSelectedNodes, setSelectedEdges, onNodeSelect, navigate, readOnly, changePoolOrientation],
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

  // Handle node mouse enter - highlight lane on hover
  const onNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      
      // If node is in a lane, highlight that lane
      const laneId = node.data?.laneId as string | undefined;
      if (laneId) {
        setHoveredLaneId(laneId);
      }
    },
    [readOnly],
  );

  // Handle node mouse leave - remove lane highlight
  const onNodeMouseLeave = useCallback(() => {
    setHoveredLaneId(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (readOnly) return;
    try {
      await saveFlow();
    } catch (error) {
      // Error handling is done in the mutation
    }
  }, [saveFlow, readOnly]);

  // Handle export image
  const handleExportImage = useCallback(
    async (format: 'png' | 'svg') => {
      await exportFlowToImage(reactFlowWrapper.current, format, {
        filename: `procedure-flow-${procedureId}`,
      });
    },
    [reactFlowWrapper, procedureId]
  );

  // Handle node drag - validate that node stays within its lane bounds
  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      
      // Skip pools (swimlanes)
      if (node.type === 'pool' || node.type === 'swimlane') {
        return;
      }

      // If node is attached to a lane, validate it stays within bounds
      const laneId = node.data?.laneId;
      const parentId = (node as any).parentId || (node as any).parentNode;
      
      if (laneId && parentId) {
        const pool = nodes.find((n) => n.id === parentId);
        if (pool && (pool.type === 'pool' || pool.type === 'swimlane') && typeof laneId === 'string') {
          // Check if node is still in lane bounds
          const isInBounds = isNodeInLaneBounds(node, pool, laneId);
          
          if (!isInBounds) {
            // Constrain node position to lane bounds
            const constrainedPos = constrainNodeToLane(node, pool, laneId);
            if (constrainedPos) {
              // Update node position to stay within lane
              updateNode(node.id, {
                position: constrainedPos,
              } as any);
            }
          }
        }
      }
    },
    [nodes, updateNode, readOnly],
  );

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
      // Simplified: use node center point for lane detection (more intuitive)
      let newParentPool: Node | null = null;
      let newLaneId: string | null = null;
      let newLaneBounds: { x: number; y: number; width: number; height: number } | null = null;

      const nodeWidth = (node.width as number) || 100;
      const nodeHeight = (node.height as number) || 50;
      
      // Use center point of node for simpler detection
      const nodeCenterX = nodeAbsolutePosition.x + nodeWidth / 2;
      const nodeCenterY = nodeAbsolutePosition.y + nodeHeight / 2;

      // Check each pool and find lane at center point
      for (const pool of poolNodes) {
        const laneResult = findLaneAtPosition(
          pool,
          nodeCenterX,
          nodeCenterY,
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
    [poolNodes, updateNode, readOnly],
  );

  // Enrich nodes with callbacks, readOnly, and isContainer
  const enrichedNodes = useMemo(() => {
    const containerNodes = nodes.filter((n) => isContainerNode(n.type));
    
    return nodes.map((node) => {
      const isContainer = isContainerNode(node.type);
      const currentStyle = (node.data?.style as Record<string, any>) || {}
      
      if (isContainer) {
        // Keep container nodes as-is, but ensure isContainer flag is set
        // Pass hoveredLaneId to pools for hover effect
        return {
          ...node,
          data: {
            ...node.data,
            isContainer: true,
            readOnly,
            hoveredLaneId: hoveredLaneId, // Pass hover state to pool
          },
        };
      }
      
      // Add isContainer: false and attach/detach handlers to all other nodes
      return {
        ...node,
        data: {
          ...node.data,
          isContainer: false,
          onAttach: handleAttachNode,
          onDetach: handleDetachNode,
          availableContainers: containerNodes.filter((c) => c.id !== node.id),
          parentId: node.parentId,
          onNodeUpdate: handleNodeStyleUpdate,
          currentStyle,
          currentHandlePositions: node.data?.handlePositions as { source?: string; target?: string } | undefined,
          flowDirection, // Pass flowDirection to node data
        },
      };
    });
  }, [nodes, handleAttachNode, handleDetachNode, handleNodeStyleUpdate, readOnly, isContainerNode, hoveredLaneId, flowDirection]);

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
        <div className={`${PALETTE_WIDTH} bg-white border-r-2 border-gray-200 shadow-lg`}>
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
          nodes={enrichedNodes}
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
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          deleteKeyCode={readOnly ? null : 'Delete'}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: 'hsl(210, 40%, 98%)', strokeWidth: 2 },
            markerEnd: { type: 'arrowclosed', color: 'hsl(210, 40%, 98%)' },
          }}
          snapToGrid={gridSettings.snapToGrid}
          snapGrid={[gridSettings.gridSize, gridSettings.gridSize]}
          fitView
          className="bg-gray-50"
        >
          {gridSettings.showGrid && getBackgroundVariant(gridSettings.backgroundPattern) && (
            <Background
              variant={getBackgroundVariant(gridSettings.backgroundPattern)!}
              gap={gridSettings.gridSize}
              size={BACKGROUND_SIZE}
              color={BACKGROUND_COLOR}
              className="bg-gray-50"
            />
          )}
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
                onChangeHandlePosition={handleChangeHandlePosition}
                onGridSettingsChange={(settings) => setGridSettings(settings)}
                onHelperLinesToggle={setShowHelperLines}
                hasSelectedNode={!!selectedNode || !!selectedEdge}
                selectedNodeCount={(selectedNode ? 1 : 0) + (selectedEdge ? 1 : 0)}
                gridSettings={gridSettings}
                showHelperLines={showHelperLines}
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
                flowDirection={flowDirection}
                onFlowDirectionChange={(direction) => {
                  setFlowDirection(direction);
                }}
                onExportImage={handleExportImage}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Right Sidebar - Properties Panel (hidden in readOnly mode) */}
      {!readOnly && (
        <div className={`${PROPERTIES_PANEL_WIDTH} bg-white border-l border-gray-200 overflow-y-auto`}>
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

