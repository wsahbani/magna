/**
 * ProcessFlowDiagram Component
 * ReactFlow editor for Process (level 2)
 * Nodes represent Procedure entities (level 3)
 * Automatically creates Procedure when PROCEDURE_NODE is dropped
 */

import { useCallback, useState, useRef } from 'react';
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

  // Handle node/edge selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodes([node.id]);
      setSelectedEdges([]);
      onNodeSelect?.(node);
    },
    [setSelectedNodes, setSelectedEdges, onNodeSelect],
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

