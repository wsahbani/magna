/**
 * ProcessFlowDiagram Component
 * ReactFlow editor for Process (level 2)
 * Nodes represent Procedure entities (level 3)
 * Automatically creates Procedure when PROCEDURE_NODE is dropped
 */

import { useCallback, useState, useRef, useMemo } from 'react';
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
import { nodeTypes } from '../../../components/FlowBuilder/nodeTypes';
import { useProcessFlowStore } from '../hooks/useProcessFlowStore';
import { PaletteConfigFactory } from '../../process-map/config/palette-config';
import { ImageExtractionModal } from './ImageExtractionModal';
import { useQueryClient } from '@tanstack/react-query';
import { processFlowKeys } from '../hooks/useProcessFlow';

interface ProcessFlowDiagramProps {
  processId: string;
  readOnly?: boolean;
  onNodeSelect?: (node: Node | null) => void;
  onEdgeSelect?: (edge: Edge | null) => void;
}

export function ProcessFlowDiagram({
  processId,
  readOnly = false,
  onNodeSelect,
  onEdgeSelect,
}: ProcessFlowDiagramProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const queryClient = useQueryClient();
  const [isImageExtractionModalOpen, setIsImageExtractionModalOpen] = useState(false);
  const [highlightedContainerId, setHighlightedContainerId] = useState<string | null>(null);

  // Get palette configuration for Process (level 2)
  const paletteConfig = PaletteConfigFactory.createByEntityType('process');

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
  } = useProcessFlowStore(processId);

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

      // For Process (level 2), PROCEDURE_NODE type should create Procedure entities
      // Other node types are just visual elements
      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType === 'PROCEDURE_NODE' ? 'procedure' : nodeType,
        position,
        data: {
          label: nodeType === 'PROCEDURE_NODE' ? 'Nouvelle Procédure' : nodeType,
          procedureId: undefined, // Will be set when Procedure is created
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode, readOnly],
  );

  // Helper function to check if a node is a container
  const isContainerNode = useCallback((nodeType: string | undefined): boolean => {
    // Only domainGroup is a container node
    return nodeType === 'domainGroup'
  }, [])

  // Helper function to check if a dragged node intersects with a container
  const checkNodeIntersection = useCallback((
    draggedNode: Node,
    containerNode: Node,
    nodes: Node[]
  ): boolean => {
    // Calculate absolute position of the dragged node
    let absoluteNodePosition = draggedNode.position;
    if (draggedNode.parentId) {
      const parent = nodes.find((n) => n.id === draggedNode.parentId);
      if (parent) {
        absoluteNodePosition = {
          x: draggedNode.position.x + parent.position.x,
          y: draggedNode.position.y + parent.position.y,
        };
      }
    }

    // Calculate container bounds
    const containerBounds = {
      x: containerNode.position.x,
      y: containerNode.position.y,
      width: (containerNode.width as number) || 200,
      height: (containerNode.height as number) || 150,
    };

    // Calculate node bounds
    const nodeBounds = {
      x: absoluteNodePosition.x,
      y: absoluteNodePosition.y,
      width: (draggedNode.width as number) || 100,
      height: (draggedNode.height as number) || 50,
    };

    // Check intersection (at least 50% overlap)
    const overlapX = Math.max(0,
      Math.min(nodeBounds.x + nodeBounds.width, containerBounds.x + containerBounds.width) -
      Math.max(nodeBounds.x, containerBounds.x)
    );
    const overlapY = Math.max(0,
      Math.min(nodeBounds.y + nodeBounds.height, containerBounds.y + containerBounds.height) -
      Math.max(nodeBounds.y, containerBounds.y)
    );
    const overlapArea = overlapX * overlapY;
    const nodeArea = nodeBounds.width * nodeBounds.height;

    return overlapArea > nodeArea * 0.5;
  }, []);

  // Handle attaching a node to a container
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

    updateNode(nodeId, {
      parentId: containerId,
      position: relativePosition,
      extent: 'parent' as const,
      data: {
        ...node.data,
        parentNodeId: containerId,
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
      },
    } as any);
  }, [nodes, updateNode, readOnly]);

  // Handle node drag - highlight containers when node intersects with them
  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      if (isContainerNode(node.type)) return;

      const containerNodes = nodes.filter((n) =>
        isContainerNode(n.type) && n.id !== node.id
      );

      // Find the container that intersects
      const intersectingContainer = containerNodes.find((container) =>
        checkNodeIntersection(node, container, nodes)
      );

      // Update highlight
      if (intersectingContainer) {
        if (highlightedContainerId !== intersectingContainer.id) {
          // Reset old container
          if (highlightedContainerId) {
            const oldContainer = nodes.find((n) => n.id === highlightedContainerId);
            if (oldContainer) {
              updateNode(highlightedContainerId, {
                data: {
                  ...oldContainer.data,
                  isHighlighted: false,
                },
              } as any);
            }
          }

          // Highlight new container
          updateNode(intersectingContainer.id, {
            data: {
              ...intersectingContainer.data,
              isHighlighted: true,
            },
          } as any);

          setHighlightedContainerId(intersectingContainer.id);
        }
      } else {
        // No container intersects, reset
        if (highlightedContainerId) {
          const oldContainer = nodes.find((n) => n.id === highlightedContainerId);
          if (oldContainer) {
            updateNode(highlightedContainerId, {
              data: {
                ...oldContainer.data,
                isHighlighted: false,
              },
            } as any);
          }
          setHighlightedContainerId(null);
        }
      }
    },
    [nodes, readOnly, isContainerNode, checkNodeIntersection, highlightedContainerId, updateNode]
  );

  // Handle node drag stop - check if node was dropped on a container
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      
      if (!reactFlowInstance) return;

      // Skip if node is a container itself
      if (isContainerNode(node.type)) return;

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

      // Find if node was dropped on a container node
      const containerNodes = nodes.filter((n) => {
        // Check if node is a container and not the dragged node itself
        if (isContainerNode(n.type) && n.id !== node.id) {
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

      // Reset highlight at the end of drag
      if (highlightedContainerId) {
        const highlightedContainer = nodes.find((n) => n.id === highlightedContainerId);
        if (highlightedContainer) {
          updateNode(highlightedContainerId, {
            data: {
              ...highlightedContainer.data,
              isHighlighted: false,
            },
          } as any);
        }
        setHighlightedContainerId(null);
      }
    },
    [nodes, updateNode, reactFlowInstance, readOnly, highlightedContainerId, setHighlightedContainerId, isContainerNode],
  );

  // Handle node/edge selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (readOnly) return;
      
      // Check if clicking on a container while another node is selected
      if (isContainerNode(node.type) && reactFlowInstance) {
        const selectedNodes = nodes.filter((n) => n.selected && n.id !== node.id && !isContainerNode(n.type));
        
        if (selectedNodes.length === 1) {
          // Attach the selected node to this container
          const selectedNode = selectedNodes[0];
          handleAttachNode(selectedNode.id, node.id);
          return; // Don't proceed with normal selection
        }
      }
      
      setSelectedNodes([node.id]);
      setSelectedEdges([]);
      onNodeSelect?.(node);
    },
    [setSelectedNodes, setSelectedEdges, onNodeSelect, readOnly, nodes, reactFlowInstance, isContainerNode, handleAttachNode],
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

  // Enrich nodes with callbacks, readOnly, and isContainer
  const enrichedNodes = useMemo(() => {
    const containerNodes = nodes.filter((n) => isContainerNode(n.type));
    
    return nodes.map((node) => {
      const isContainer = isContainerNode(node.type)
      const currentStyle = (node.data?.style as Record<string, any>) || {}
      
      if (node.type === 'domainGroup') {
        return {
          ...node,
          data: {
            ...node.data,
            isContainer: true,
            readOnly,
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
        },
      };
    });
  }, [nodes, handleAttachNode, handleDetachNode, handleNodeStyleUpdate, readOnly, isContainerNode]);

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      await saveFlow();
    } catch (error) {
      // Error handling is done in the mutation
    }
  }, [saveFlow]);

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
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
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
              if (node.type === 'procedure') return '#ea580c';
              if (node.type === 'startEvent') return '#4caf50';
              if (node.type === 'endEvent') return '#f44336';
              return '#9e9e9e';
            }}
            className="bg-white shadow-lg rounded-lg border border-gray-200"
            pannable
            zoomable
          />
          
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
            onNodeUpdate={handleNodeStyleUpdate}
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
          processId={processId}
          existingNodesCount={nodes.length}
          onSuccess={async (result) => {
            // Invalidate and refetch flow data to get the new nodes
            await queryClient.invalidateQueries({
              queryKey: processFlowKeys.detail(processId),
            });
            setIsImageExtractionModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

