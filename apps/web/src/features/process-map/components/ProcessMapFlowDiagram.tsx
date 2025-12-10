/**
 * ProcessMapFlowDiagram Component
 * ReactFlow editor for ProcessMap (level 1)
 * Nodes represent Process entities (level 2)
 * Automatically creates Process when PROCESS_NODE is dropped
 */

import { useCallback, useState, useEffect, useRef } from 'react';
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
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Palette } from '../../../components/FlowBuilder/Palette';
import { PropertiesPanel } from '../../../components/FlowBuilder/PropertiesPanel';
import { Toolbar } from '../../../components/FlowBuilder/Toolbar';
import { nodeTypes } from '../../../components/FlowBuilder/nodeTypes';
import { useProcessMapFlow, useSaveProcessMapFlow } from '../hooks/useProcessMapFlow';
import { PaletteConfigFactory } from '../config/palette-config';
import { getBackgroundVariant } from '../../../components/FlowBuilder/utils/gridUtils';

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
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  
  // Grid settings state
  const [gridSettings, setGridSettings] = useState({
    snapToGrid: false,
    gridSize: 15,
    showGrid: true,
    backgroundPattern: 'dots' as 'dots' | 'lines' | 'cross' | 'none',
  });
  const [showHelperLines, setShowHelperLines] = useState(true);

  // Get palette configuration for ProcessMap (level 1)
  const paletteConfig = PaletteConfigFactory.createByEntityType('processMap');

  // Load flow data
  const { data: flowData, isLoading } = useProcessMapFlow(processMapId);
  const saveFlowMutation = useSaveProcessMapFlow();

  // Initialize nodes and edges from API with explicit typing
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Load flow data when available
  useEffect(() => {
    if (flowData) {
      setNodes(flowData.nodes || []);
      setEdges(flowData.edges || []);
    }
  }, [flowData, setNodes, setEdges]);

  // Sync selectedNode with nodes when nodes change
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find(n => n.id === selectedNode.id);
      if (updatedNode && updatedNode !== selectedNode) {
        setSelectedNode(updatedNode);
      }
    }
  }, [nodes, selectedNode]);

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

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes, readOnly],
  );

  // Handle connections
  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, readOnly],
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

      const currentNodeWithParent = currentNode as Node & { parentNode?: string };
      
      // Calculate absolute position if node currently has a parent
      let absoluteNodePosition = currentNode.position;
      if (currentNodeWithParent.parentNode) {
        const currentParent = nodes.find((n) => n.id === currentNodeWithParent.parentNode);
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
        
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              const nodeWithParent = { ...n, parentNode: containerNode.id, position: relativePosition, extent: 'parent' as const };
              return nodeWithParent as Node;
            }
            return n;
          }),
        );
      } else if (currentNodeWithParent.parentNode) {
        // Node was dragged out of container - remove parent relationship
        const parentNode = nodes.find((n) => n.id === currentNodeWithParent.parentNode);
        if (parentNode) {
          // Convert relative position back to absolute
          const absolutePosition = {
            x: currentNode.position.x + parentNode.position.x,
            y: currentNode.position.y + parentNode.position.y,
          };
          
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === node.id) {
                const nodeWithoutParent = { ...n, position: absolutePosition };
                delete (nodeWithoutParent as any).parentNode;
                delete (nodeWithoutParent as any).extent;
                return nodeWithoutParent as Node;
              }
              return n;
            }),
          );
        }
      }
    },
    [nodes, setNodes, reactFlowInstance, readOnly],
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
      setSelectedNode(node);
      setSelectedEdge(null);
      onNodeSelect?.(node);
    },
    [onNodeSelect, navigate, readOnly],
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge);
      setSelectedNode(null);
      onEdgeSelect?.(edge);
    },
    [onEdgeSelect],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    onNodeSelect?.(null);
    onEdgeSelect?.(null);
  }, [onNodeSelect, onEdgeSelect]);

  // Handle change handle positions
  const handleChangeHandlePosition = useCallback(
    (sourcePos: 'top' | 'right' | 'bottom' | 'left', targetPos: 'top' | 'right' | 'bottom' | 'left') => {
      if (!selectedNode) return;
      
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                handlePositions: {
                  source: sourcePos,
                  target: targetPos,
                },
              },
            };
          }
          return node;
        }),
      );
      
      // Update selectedNode state
      setSelectedNode((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            handlePositions: {
              source: sourcePos,
              target: targetPos,
            },
          },
        };
      });
    },
    [selectedNode, setNodes],
  );

  // Handle save
  const handleSave = useCallback(() => {
    saveFlowMutation.mutate({
      processMapId,
      nodes,
      edges,
    });
  }, [processMapId, nodes, edges, saveFlowMutation]);

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
                isSaving={saveFlowMutation.isPending}
                saveError={saveFlowMutation.error}
                onFitView={() => reactFlowInstance?.fitView()}
                onZoomIn={() => reactFlowInstance?.zoomIn()}
                onZoomOut={() => reactFlowInstance?.zoomOut()}
                onDelete={() => {
                  const selectedNodes = nodes.filter(n => n.selected)
                  const selectedEdges = edges.filter(e => e.selected)
                  if (selectedNodes.length > 0 || selectedEdges.length > 0) {
                    setNodes((nds) => nds.filter(n => !n.selected))
                    setEdges((eds) => eds.filter(e => !e.selected))
                  }
                }}
                onChangeHandlePosition={handleChangeHandlePosition}
                onGridSettingsChange={setGridSettings}
                onHelperLinesToggle={setShowHelperLines}
                hasSelectedNode={!!selectedNode}
                selectedNodeCount={nodes.filter(n => n.selected).length}
                gridSettings={gridSettings}
                showHelperLines={showHelperLines}
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
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === nodeId) {
                    // Merge style properly if it exists in data
                    const updatedData = { ...node.data, ...data };
                    if (data.style && node.data?.style) {
                      updatedData.style = { ...node.data.style, ...data.style };
                    }
                    return { ...node, data: updatedData };
                  }
                  return node;
                }),
              );
              // Update selectedNode to reflect changes immediately
              if (selectedNode && selectedNode.id === nodeId) {
                const updatedData = { ...selectedNode.data, ...data };
                if (data.style && selectedNode.data?.style) {
                  updatedData.style = { ...selectedNode.data.style, ...data.style };
                }
                setSelectedNode({ ...selectedNode, data: updatedData });
              }
            }}
            onEdgeUpdate={(edgeId, data) => {
              setEdges((eds) =>
                eds.map((edge) => (edge.id === edgeId ? { ...edge, ...data } : edge)),
              );
              // Update selectedEdge to reflect changes immediately
              if (selectedEdge && selectedEdge.id === edgeId) {
                setSelectedEdge({ ...selectedEdge, ...data });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

