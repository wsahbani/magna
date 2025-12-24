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
import { exportFlowToImage } from '../../../components/FlowBuilder/utils/exportFlowImage';

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

  // State to track which container is currently highlighted during drag
  const [highlightedContainerId, setHighlightedContainerId] = useState<string | null>(null);

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
    flowDirection,
    setFlowDirection,
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
    [nodes, updateNode, reactFlowInstance, readOnly, highlightedContainerId, setHighlightedContainerId],
  );

  // Handle node/edge selection with navigation for linked nodes
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
      
      // Check if clicking on a container while another node is selected
      if (isContainerNode(node.type) && reactFlowInstance) {
        const selectedNodes = nodes.filter((n) => n.selected && n.id !== node.id && !isContainerNode(n.type));
        
        if (selectedNodes.length === 1) {
          // Attach the selected node to this container
          const selectedNode = selectedNodes[0];
          handleAttachNode(selectedNode.id, node.id);
          return; // Don't proceed with navigation
        }
      }
      
      // Normal selection behavior
      setSelectedNodes([node.id]);
      setSelectedEdges([]);
      onNodeSelect?.(node);
    },
    [onNodeSelect, navigate, readOnly, nodes, reactFlowInstance, isContainerNode, handleAttachNode, setSelectedNodes, setSelectedEdges],
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

  // Handle export image
  const handleExportImage = useCallback(
    async (format: 'png' | 'svg') => {
      await exportFlowToImage(reactFlowWrapper.current, format, {
        filename: `process-map-flow-${processMapId}`,
      });
    },
    [reactFlowWrapper, processMapId]
  );

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

  /**
   * Handle auto-layout for domainGroup children
   * Arranges child nodes in a grid layout within the group
   * Dynamically calculates spacing based on actual node dimensions to avoid overlaps
   * 
   * @param groupId - The ID of the domain group node
   * @param options - Optional layout parameters:
   *   - minHorizontalSpacing: Minimum space between nodes horizontally (default: 20px)
   *   - minVerticalSpacing: Minimum space between nodes vertically (default: 20px)
   *   - padding: Padding from group edges (default: 40px)
   * 
   * Layout parameters can also be set via group node data:
   *   - layoutMinHorizontalSpacing
   *   - layoutMinVerticalSpacing
   *   - layoutPadding
   * 
   * Priority: options > groupNode.data > defaults
   */
  const handleAutoLayout = useCallback(
    (groupId: string, options?: { minHorizontalSpacing?: number; minVerticalSpacing?: number; padding?: number }) => {
      if (readOnly) return;

      // Get the group node
      const groupNode = nodes.find((n) => n.id === groupId);
      if (!groupNode || groupNode.type !== 'domainGroup') return;

      // Get all children of this group
      const children = nodes.filter((n) => (n as any).parentId === groupId);
      
      if (children.length === 0) return;

      // Layout constants - can be overridden via options or group node data
      const PADDING: number = (options?.padding ?? groupNode.data?.layoutPadding ?? 40) as number; // Padding from group edges
      const HEADER_HEIGHT: number = 60; // Height of the header with label
      const MIN_HORIZONTAL_SPACING: number = (options?.minHorizontalSpacing ?? groupNode.data?.layoutMinHorizontalSpacing ?? 20) as number; // Minimum spacing between nodes horizontally
      const MIN_VERTICAL_SPACING: number = (options?.minVerticalSpacing ?? groupNode.data?.layoutMinVerticalSpacing ?? 20) as number; // Minimum spacing between nodes vertically

      // Default node dimensions if not specified
      const DEFAULT_NODE_WIDTH = 140;
      const DEFAULT_NODE_HEIGHT = 80;

      // Get actual dimensions for each child node
      const nodesWithDimensions = children.map((child) => {
        const width = (child.width as number) || (child.data?.width as number) || DEFAULT_NODE_WIDTH;
        const height = (child.height as number) || (child.data?.height as number) || DEFAULT_NODE_HEIGHT;
        return {
          ...child,
          actualWidth: width,
          actualHeight: height,
        };
      });

      // Calculate optimal grid layout
      const childCount = children.length;
      const columns = Math.ceil(Math.sqrt(childCount));
      const rows = Math.ceil(childCount / columns);

      // Calculate max width per column and max height per row
      const columnWidths: number[] = Array.from({ length: columns }, () => 0);
      const rowHeights: number[] = Array.from({ length: rows }, () => 0);

      nodesWithDimensions.forEach((node, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        
        columnWidths[col] = Math.max(columnWidths[col] || 0, node.actualWidth);
        rowHeights[row] = Math.max(rowHeights[row] || 0, node.actualHeight);
      });

      // Calculate cumulative positions for each column and row
      const columnPositions: number[] = [PADDING];
      for (let i = 0; i < columns - 1; i++) {
        const colWidth: number = columnWidths[i] ?? 0;
        const currentPos: number = columnPositions[i] ?? 0;
        columnPositions.push(
          currentPos + colWidth + MIN_HORIZONTAL_SPACING
        );
      }

      const rowPositions: number[] = [PADDING + HEADER_HEIGHT];
      for (let i = 0; i < rows - 1; i++) {
        const rowHeight: number = rowHeights[i] ?? 0;
        const currentPos: number = rowPositions[i] ?? 0;
        rowPositions.push(
          currentPos + rowHeight + MIN_VERTICAL_SPACING
        );
      }

      // Calculate required dimensions for the grid
      const lastColIndex = columns - 1;
      const lastRowIndex = rows - 1;
      const lastColWidth: number = columnWidths[lastColIndex] ?? 0;
      const lastRowHeight: number = rowHeights[lastRowIndex] ?? 0;
      const lastColPos: number = columnPositions[lastColIndex] ?? 0;
      const lastRowPos: number = rowPositions[lastRowIndex] ?? 0;
      const totalWidth = lastColPos + lastColWidth + PADDING;
      const totalHeight = lastRowPos + lastRowHeight + PADDING;

      // Get group dimensions
      const groupWidth = (groupNode.width as number) || 200;
      const groupHeight = (groupNode.height as number) || 150;

      // Update group size if needed
      let finalGroupWidth = Math.max(groupWidth, totalWidth);
      let finalGroupHeight = Math.max(groupHeight, totalHeight);
      
      if (finalGroupWidth !== groupWidth || finalGroupHeight !== groupHeight) {
        updateNode(groupId, {
          width: finalGroupWidth,
          height: finalGroupHeight,
        } as any);
      }

      // Calculate positions for each child node (centered within its grid cell)
      nodesWithDimensions.forEach((node, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        
        // Center the node within its grid cell
        const cellWidth = columnWidths[col];
        const cellHeight = rowHeights[row];
        
        const relativeX = columnPositions[col] + (cellWidth - node.actualWidth) / 2;
        const relativeY = rowPositions[row] + (cellHeight - node.actualHeight) / 2;

        updateNode(node.id, {
          position: {
            x: relativeX,
            y: relativeY,
          },
        } as any);
      });
    },
    [nodes, updateNode, readOnly],
  );

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
            onAddMainProcess: handleAddMainProcessToGroup,
            onAutoLayout: handleAutoLayout,
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
          flowDirection, // Pass flowDirection to node data
        },
      };
    });
  }, [nodes, handleAddMainProcessToGroup, handleAutoLayout, handleAttachNode, handleDetachNode, handleNodeStyleUpdate, readOnly, isContainerNode, flowDirection]);

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
          onNodeDrag={onNodeDrag}
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
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: 'hsl(210, 40%, 98%)', strokeWidth: 2 },
            markerEnd: { type: 'arrowclosed', color: 'hsl(210, 40%, 98%)' },
          }}
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
              color={gridSettings.backgroundPattern === 'lines' ? '#ddd' : '#000'}
              className="bg-gray-100"
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

