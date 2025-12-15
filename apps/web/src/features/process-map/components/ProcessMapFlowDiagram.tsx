/**
 * ProcessMapFlowDiagram Component
 * ReactFlow editor for ProcessMap (level 1)
 * Nodes represent Process entities (level 2)
 * Automatically creates Process when PROCESS_NODE is dropped
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
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Palette } from '../../../components/FlowBuilder/Palette';
import { PropertiesPanel } from '../../../components/FlowBuilder/PropertiesPanel';
import { Toolbar } from '../../../components/FlowBuilder/Toolbar';
import { nodeTypes } from '../../../components/FlowBuilder/nodeTypes';
import { useProcessMapFlowStore } from '../hooks/useProcessMapFlowStore';
import { PaletteConfigFactory } from '../config/palette-config';
import { getBackgroundVariant } from '../../../components/FlowBuilder/utils/gridUtils';
import { ImageExtractionModal } from './ImageExtractionModal';
import { processMapFlowKeys } from '../hooks/useProcessMapFlow';

interface ProcessMapFlowDiagramProps {
  processMapId: string;
  readOnly?: boolean;
  onNodeSelect?: (node: Node | null) => void;
  onEdgeSelect?: (edge: Edge | null) => void;
}

export function ProcessMapFlowDiagram({
  processMapId,
  readOnly = false,
  onNodeSelect,
  onEdgeSelect,
}: ProcessMapFlowDiagramProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // Grid settings state (UI state, not flow state)
  const [gridSettings, setGridSettings] = useState({
    snapToGrid: false,
    gridSize: 15,
    showGrid: true,
    backgroundPattern: 'dots' as 'dots' | 'lines' | 'cross' | 'none',
  });
  const [showHelperLines, setShowHelperLines] = useState(true);

  // Image extraction modal state
  const [isImageExtractionModalOpen, setIsImageExtractionModalOpen] = useState(false);

  // Get palette configuration for ProcessMap (level 1)
  const paletteConfig = PaletteConfigFactory.createByEntityType('processMap');

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
  } = useProcessMapFlowStore(processMapId);

  // Sync selectedNode/selectedEdge with store when nodes/edges change
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find((n) => n.id === selectedNode.id);
      if (updatedNode && updatedNode !== selectedNode) {
        setSelectedNodes([updatedNode.id]);
      }
    }
  }, [nodes, selectedNode, setSelectedNodes]);

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

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // For ProcessMap (level 1), only PROCESS_NODE type should create Process entities
      // Other node types are just visual elements
      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType === 'PROCESS_NODE' ? 'process' : nodeType,
        position,
        data: {
          label: nodeType === 'PROCESS_NODE' ? 'Nouveau Processus' : nodeType,
          processId: undefined, // Will be set when Process is created
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode, readOnly],
  );

  // Handle node drag stop - check if node was dropped on a container
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      
      if (!reactFlowInstance) return;

      // Skip if node is a container itself (domainGroup)
      if (node.type === 'domainGroup') return;

      // Get current node state from nodes array (may have been updated by ReactFlow)
      const currentNode = nodes.find((n) => n.id === node.id);
      if (!currentNode) return;

      // Use parentId at top level (ReactFlow standard)
      const currentNodeWithParent = currentNode as Node & { parentId?: string };
      
      // Calculate absolute position if node currently has a parent
      let absoluteNodePosition = currentNode.position;
      if (currentNodeWithParent.parentId) {
        const currentParent = nodes.find((n) => n.id === currentNodeWithParent.parentId);
        if (currentParent) {
          // Convert relative position to absolute for overlap calculation
          absoluteNodePosition = {
            x: currentNode.position.x + currentParent.position.x,
            y: currentNode.position.y + currentParent.position.y,
          };
        }
      }

      // Find if node was dropped on a container node (domainGroup)
      const containerNodes = nodes.filter((n) => {
        // Check if node type is domainGroup (container) and not the dragged node itself
        if (n.type === 'domainGroup' && n.id !== node.id) {
          const containerBounds = {
            x: n.position.x,
            y: n.position.y,
            width: (n.width as number) || 200,
            height: (n.height as number) || 150,
          };
          
          // Get node bounds using absolute position
          const nodeBounds = {
            x: absoluteNodePosition.x,
            y: absoluteNodePosition.y,
            width: (currentNode.width as number) || 100,
            height: (currentNode.height as number) || 50,
          };
          
          // Check if node overlaps with container (at least 50% of node area)
          const overlapX = Math.max(0, Math.min(nodeBounds.x + nodeBounds.width, containerBounds.x + containerBounds.width) - Math.max(nodeBounds.x, containerBounds.x));
          const overlapY = Math.max(0, Math.min(nodeBounds.y + nodeBounds.height, containerBounds.y + containerBounds.height) - Math.max(nodeBounds.y, containerBounds.y));
          const overlapArea = overlapX * overlapY;
          const nodeArea = nodeBounds.width * nodeBounds.height;
          
          return overlapArea > nodeArea * 0.5; // At least 50% overlap
        }
        return false;
      });

      if (containerNodes.length > 0) {
        // Node was dropped on a container - set parent relationship
        const containerNode = containerNodes[0];
        
        // Calculate relative position within container using absolute position
        const relativePosition = {
          x: absoluteNodePosition.x - containerNode.position.x,
          y: absoluteNodePosition.y - containerNode.position.y,
        };
        
        // Set parentId and extent at top level (ReactFlow standard)
        updateNode(node.id, {
          parentId: containerNode.id,
          position: relativePosition,
          extent: 'parent' as const,
          data: {
            ...currentNode.data,
            parentNodeId: containerNode.id, // Store in data for persistence
          },
        } as any);
      } else if (currentNodeWithParent.parentId) {
        // Node was dragged out of container - remove parent relationship
        const parentNode = nodes.find((n) => n.id === currentNodeWithParent.parentId);
        if (parentNode) {
          // Convert relative position back to absolute
          const absolutePosition = {
            x: currentNode.position.x + parentNode.position.x,
            y: currentNode.position.y + parentNode.position.y,
          };
          
          updateNode(node.id, {
            parentId: undefined,
            position: absolutePosition,
            extent: undefined,
            data: {
              ...currentNode.data,
              parentNodeId: undefined, // Remove from data
            },
          } as any);
        }
      }
    },
    [nodes, updateNode, reactFlowInstance, readOnly],
  );

  // Handle node/edge selection with navigation for linked nodes
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Check if node has a linked process and we're in read-only mode or double-click
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
      
      // Normal selection behavior
      setSelectedNodes([node.id]);
      setSelectedEdges([]);
      onNodeSelect?.(node);
    },
    [onNodeSelect, navigate, readOnly],
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdges([edge.id]);
      setSelectedNodes([]);
      onEdgeSelect?.(edge);
    },
    [onEdgeSelect, setSelectedEdges, setSelectedNodes],
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
    onNodeSelect?.(null);
    onEdgeSelect?.(null);
  }, [onNodeSelect, onEdgeSelect, clearSelection]);

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

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      await saveFlow();
    } catch (error) {
      // Error handling is done in the mutation
    }
  }, [saveFlow]);

  // Handle adding mainProcess to a domainGroup
  const handleAddMainProcessToGroup = useCallback(
    (groupId: string) => {
      if (readOnly) return;

      // Get the group node
      const groupNode = nodes.find((n) => n.id === groupId);
      if (!groupNode || groupNode.type !== 'domainGroup') return;

      // Get all children of this group
      const children = nodes.filter((n) => (n as any).parentId === groupId);

      // Constants for mainProcess node
      const MAIN_PROCESS_WIDTH = 140; // minWidth of mainProcess
      const MAIN_PROCESS_HEIGHT = 80; // minHeight of mainProcess
      const SPACING = 20; // Spacing between nodes

      // Get group dimensions
      const groupWidth = (groupNode.width as number) || 200;
      const groupHeight = (groupNode.height as number) || 150;

      // Calculate new positions for all nodes (existing + new)
      const totalNodes = children.length + 1;
      const totalWidthNeeded = totalNodes * (MAIN_PROCESS_WIDTH + SPACING) - SPACING;
      
      // Check if group width needs to be increased
      let finalGroupWidth = groupWidth;
      if (totalWidthNeeded > groupWidth) {
        finalGroupWidth = totalWidthNeeded + 100; // 100px margin
        updateNode(groupId, {
          width: finalGroupWidth,
        } as any);
      }

      // Calculate center position for the group
      const centerX = finalGroupWidth / 2;
      const centerY = groupHeight / 2;

      // New node always goes to center
      const newPosition = {
        x: centerX - MAIN_PROCESS_WIDTH / 2,
        y: centerY - MAIN_PROCESS_HEIGHT / 2,
      };

      // Reposition all existing nodes: they all shift left by one position
      // The new node will be at index 0 (center)
      // Existing nodes will be at indices -1, -2, -3, etc. (to the left of center)
      
      // Sort children by current X position to maintain visual order
      const sortedChildren = [...children].sort((a, b) => a.position.x - b.position.x);
      
      // Calculate positions for all existing nodes
      // They will be positioned to the left of center, starting from index -1
      sortedChildren.forEach((child, index) => {
        // Each existing node moves to index -(index + 1)
        // First existing node: index -1
        // Second existing node: index -2
        // etc.
        const nodeIndex = -(index + 1);
        const newX = centerX + nodeIndex * (MAIN_PROCESS_WIDTH + SPACING) - MAIN_PROCESS_WIDTH / 2;
        
        updateNode(child.id, {
          position: {
            x: newX,
            y: centerY - MAIN_PROCESS_HEIGHT / 2,
          },
        } as any);
      });

      // Create new mainProcess node
      const newNode: Node = {
        id: `mainProcess-${Date.now()}`,
        type: 'mainProcess',
        position: newPosition,
        parentId: groupId,
        extent: 'parent' as const,
        width: MAIN_PROCESS_WIDTH,
        height: MAIN_PROCESS_HEIGHT,
        data: {
          label: 'Nouveau Processus',
          processId: undefined,
        },
      };

      addNode(newNode);
    },
    [nodes, addNode, updateNode, readOnly],
  );

  // Enrich nodes with callbacks and readOnly for domainGroup nodes
  const enrichedNodes = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === 'domainGroup') {
        return {
          ...node,
          data: {
            ...node.data,
            onAddMainProcess: handleAddMainProcessToGroup,
            readOnly,
          },
        };
      }
      return node;
    });
  }, [nodes, handleAddMainProcessToGroup, readOnly]);

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
          nodes={enrichedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDrop={readOnly ? undefined : onDrop}
          onDragOver={readOnly ? undefined : onDragOver}
          nodeTypes={nodeTypes}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          deleteKeyCode={readOnly ? null : 'Delete'}
          snapToGrid={gridSettings.snapToGrid}
          snapGrid={[gridSettings.gridSize, gridSettings.gridSize]}
          fitView
          attributionPosition="bottom-right"
          multiSelectionKeyCode="Control"
        >
          {/* Background */}
          {gridSettings.showGrid && getBackgroundVariant(gridSettings.backgroundPattern) && (
            <Background
              variant={getBackgroundVariant(gridSettings.backgroundPattern)!}
              gap={gridSettings.gridSize}
              size={gridSettings.backgroundPattern === 'dots' ? 1 : 0.5}
              color={gridSettings.backgroundPattern === 'lines' ? '#ddd' : '#ff6900'}
              className="bg-gray-50"
            />
          )}

          {/* Controls */}
          <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            className="bg-white shadow-lg rounded-lg border border-gray-200"
          />

          {/* Minimap */}
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'process') return '#ea580c';
              if (node.type === 'startEvent') return '#4caf50';
              if (node.type === 'endEvent') return '#f44336';
              return '#9e9e9e';
            }}
            className="bg-white shadow-lg rounded-lg border border-gray-200"
            pannable
            zoomable
          />

          {/* Top Toolbar (hidden in readOnly mode) */}
          {!readOnly && (
            <Panel position="top-left" className="bg-white shadow-lg rounded-lg border border-gray-200 p-2 z-50">
              <Toolbar
                onSave={handleSave}
                isSaving={isSaving}
                saveError={undefined}
                onFitView={() => reactFlowInstance?.fitView()}
                onZoomIn={() => reactFlowInstance?.zoomIn()}
                onZoomOut={() => reactFlowInstance?.zoomOut()}
                onDelete={() => {
                  const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
                  const selectedEdgeIds = edges.filter((e) => e.selected).map((e) => e.id);
                  if (selectedNodeIds.length > 0) {
                    deleteNodes(selectedNodeIds);
                  }
                  if (selectedEdgeIds.length > 0) {
                    deleteEdges(selectedEdgeIds);
                  }
                }}
                onChangeHandlePosition={handleChangeHandlePosition}
                onGridSettingsChange={setGridSettings}
                onHelperLinesToggle={setShowHelperLines}
                hasSelectedNode={!!selectedNode}
                selectedNodeCount={nodes.filter(n => n.selected).length}
                gridSettings={gridSettings}
                showHelperLines={showHelperLines}
                onExtractFromImage={() => setIsImageExtractionModalOpen(true)}
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
            onNodeUpdate={(nodeId, data) => {
              const node = nodes.find((n) => n.id === nodeId);
              if (!node) return;

              // Merge style properly if it exists in data
              const updatedData = { ...node.data, ...data };
              if (data.style && node.data?.style) {
                updatedData.style = { ...node.data.style, ...data.style };
              }

              updateNode(nodeId, {
                data: updatedData,
              });
            }}
            onEdgeUpdate={(edgeId, data) => {
              updateEdge(edgeId, data);
            }}
          />
        </div>
      )}

      {/* Image Extraction Modal */}
      {!readOnly && (
        <>
          <ImageExtractionModal
            open={isImageExtractionModalOpen}
            onOpenChange={setIsImageExtractionModalOpen}
            processMapId={processMapId}
            existingNodesCount={nodes.length}
            onSuccess={async () => {
              // Invalidate and refetch flow data to get the new nodes
              await queryClient.invalidateQueries({
                queryKey: processMapFlowKeys.detail(processMapId),
              });
              setIsImageExtractionModalOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}

