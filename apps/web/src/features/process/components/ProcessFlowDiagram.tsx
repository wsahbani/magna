/**
 * ProcessFlowDiagram Component
 * ReactFlow editor for Process (level 2)
 * Nodes represent Procedure entities (level 3)
 * Automatically creates Procedure when PROCEDURE_NODE is dropped
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
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { Palette } from '../../../components/FlowBuilder/Palette';
import { PropertiesPanel } from '../../../components/FlowBuilder/PropertiesPanel';
import { Toolbar } from '../../../components/FlowBuilder/Toolbar';
import { nodeTypes } from '../../../components/FlowBuilder/nodeTypes';
import { useProcessFlow, useSaveProcessFlow } from '../hooks/useProcessFlow';
import { PaletteConfigFactory } from '../../process-map/config/palette-config';

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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  // Get palette configuration for Process (level 2)
  const paletteConfig = PaletteConfigFactory.createByEntityType('process');

  // Load flow data
  const { data: flowData, isLoading } = useProcessFlow(processId);
  const saveFlowMutation = useSaveProcessFlow();

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

  // Handle node/edge selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setSelectedEdge(null);
      onNodeSelect?.(node);
    },
    [onNodeSelect],
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

  // Handle node update (from PropertiesPanel)
  const onNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<Node>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            const updatedNode = { ...n, ...updates };
            // Merge style objects if they exist
            if (updates.data?.style && n.data?.style) {
              updatedNode.data = {
                ...updatedNode.data,
                style: { ...n.data.style, ...updates.data.style },
              };
            }
            return updatedNode;
          }
          return n;
        }),
      );
    },
    [setNodes],
  );

  // Handle save
  const handleSave = useCallback(() => {
    saveFlowMutation.mutate({
      processId,
      nodes,
      edges,
    });
  }, [processId, nodes, edges, saveFlowMutation]);

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
            <Panel position="top-left" className="bg-white shadow-lg rounded-lg border border-gray-200 p-2">
              <Toolbar
                onSave={handleSave}
                isSaving={saveFlowMutation.isPending}
                saveError={saveFlowMutation.error as Error | null}
                onFitView={() => reactFlowInstance?.fitView()}
                onZoomIn={() => reactFlowInstance?.zoomIn()}
                onZoomOut={() => reactFlowInstance?.zoomOut()}
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

