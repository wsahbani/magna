# Flow Diagram API

This document describes the API endpoints for saving and retrieving process flow diagrams built with ReactFlow.

## Overview

The Flow API allows you to:
- Save complete flow diagrams (nodes + edges) for a process
- Retrieve flow diagrams for viewing/editing
- Update flow layout settings (zoom, viewport, grid)

All flow data is versioned - each process can have multiple versions (draft, published, etc.)

## Architecture

### Data Flow

```
Frontend (ReactFlow) → API → Database
                           ↓
                    ProcessVersion
                    ├── Nodes (position, style, data)
                    └── Edges (connections, style, labels)
```

### Version Management

- **Draft Version**: Current working version (editable)
- **Published Version**: Approved and published version (read-only)
- Each save operation updates the current draft version
- Nodes and edges are completely replaced on each save (full sync)

## API Endpoints

### 1. Save Flow Diagram

**Endpoint:** `POST /processes/flow/save`

**Description:** Saves a complete flow diagram (all nodes and edges) for a process. Creates a new draft version if none exists, or updates the current draft.

**Request Body:**

```typescript
{
  processId: string;           // Process ID
  nodes: SaveNodeDto[];        // Array of nodes
  edges: SaveEdgeDto[];        // Array of edges
  changesLog?: string;         // Optional description of changes
}
```

**Node Structure:**

```typescript
{
  id: string;                  // Unique node ID
  type: NodeType;              // TASK, START_EVENT, END_EVENT, GROUP, etc.
  label: string;               // Node label
  description?: string;        // Optional description
  positionX: number;           // X coordinate
  positionY: number;           // Y coordinate
  width?: number;              // Node width
  height?: number;             // Node height
  zIndex?: number;             // Z-order
  parentNodeId?: string;       // Parent node ID (for groups)
  groupId?: string;            // Group identifier
  sourcePosition?: HandlePosition; // TOP, RIGHT, BOTTOM, LEFT
  targetPosition?: HandlePosition;
  isConnectable?: boolean;
  isDraggable?: boolean;
  isSelectable?: boolean;
  style?: {                    // Styling
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    color?: string;            // Text color
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
    opacity?: number;
  };
  data?: any;                  // Custom data
}
```

**Edge Structure:**

```typescript
{
  id: string;                  // Unique edge ID
  source: string;              // Source node ID
  target: string;              // Target node ID
  type?: EdgeType;             // SEQUENCE_FLOW, CONDITIONAL_FLOW, etc.
  label?: string;              // Edge label
  animated?: boolean;          // Animated flow
  pathType?: PathType;         // SMOOTH_STEP, BEZIER, STRAIGHT, STEP
  sourceHandle?: string;       // Source handle ID
  targetHandle?: string;       // Target handle ID
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
  data?: any;                  // Custom data
}
```

**Response:**

```typescript
{
  versionId: string;           // Version ID where flow was saved
  version: number;             // Version number
  nodesCount: number;          // Number of nodes saved
  edgesCount: number;          // Number of edges saved
  nodes: Node[];               // Saved nodes
  edges: Edge[];               // Saved edges
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3001/processes/flow/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "processId": "clx123456",
    "nodes": [
      {
        "id": "node-1",
        "type": "START_EVENT",
        "label": "Start",
        "positionX": 100,
        "positionY": 100,
        "width": 80,
        "height": 80,
        "style": {
          "backgroundColor": "#10b981",
          "borderColor": "#059669"
        }
      },
      {
        "id": "node-2",
        "type": "TASK",
        "label": "Review Request",
        "positionX": 250,
        "positionY": 100,
        "width": 120,
        "height": 80,
        "style": {
          "fontSize": 14,
          "fontWeight": "bold"
        }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "type": "SEQUENCE_FLOW",
        "animated": false
      }
    ],
    "changesLog": "Added review step"
  }'
```

---

### 2. Get Flow Diagram

**Endpoint:** `GET /processes/:id/flow`

**Description:** Retrieves the flow diagram for a process. Returns the current draft version by default, or a specific version if requested.

**Parameters:**

- `id` (path): Process ID
- `version` (query, optional): Specific version number to load

**Response:**

```typescript
{
  processId: string;
  versionId: string;
  version: number;
  status: ProcessStatus;       // DRAFT, PUBLISHED, etc.
  nodes: ReactFlowNode[];      // Nodes in ReactFlow format
  edges: ReactFlowEdge[];      // Edges in ReactFlow format
  layout?: {                   // Layout settings
    zoom?: number;
    viewportX?: number;
    viewportY?: number;
    snapToGrid?: boolean;
    gridSize?: number;
  };
}
```

**ReactFlow Node Format:**

```typescript
{
  id: string;
  type: string;                // Lowercase type
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    style: { ... };            // All style properties
    ...                        // Custom data
  };
  style: {
    width?: number;
    height?: number;
    zIndex?: number;
  };
  parentNode?: string;
  extent?: 'parent';
  draggable: boolean;
  selectable: boolean;
  connectable: boolean;
}
```

**Example Request:**

```bash
# Get current draft
curl -X GET http://localhost:3001/processes/clx123456/flow \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get specific version
curl -X GET http://localhost:3001/processes/clx123456/flow?version=2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Update Flow Layout

**Endpoint:** `PATCH /processes/:id/flow/layout`

**Description:** Updates the flow layout settings (zoom level, viewport position, grid settings).

**Request Body:**

```typescript
{
  zoom?: number;               // Zoom level (0.1 to 5.0)
  viewportX?: number;          // Viewport X position
  viewportY?: number;          // Viewport Y position
  snapToGrid?: boolean;        // Enable snap to grid
  gridSize?: number;           // Grid size in pixels
}
```

**Response:**

```typescript
{
  id: string;
  versionId: string;
  zoom: number;
  viewportX: number;
  viewportY: number;
  snapToGrid: boolean;
  gridSize: number;
}
```

**Example Request:**

```bash
curl -X PATCH http://localhost:3001/processes/clx123456/flow/layout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "zoom": 1.2,
    "viewportX": 100,
    "viewportY": 50,
    "snapToGrid": true,
    "gridSize": 20
  }'
```

---

## Node Types

Supported node types (from Prisma schema):

### Events
- `START_EVENT` - Process start
- `END_EVENT` - Process end
- `INTERMEDIATE_EVENT` - Intermediate event

### Activities
- `TASK` - Basic task
- `USER_TASK` - User task
- `SERVICE_TASK` - Service task
- `SCRIPT_TASK` - Script task
- `SEND_TASK` - Send task
- `RECEIVE_TASK` - Receive task
- `MANUAL_TASK` - Manual task
- `BUSINESS_RULE_TASK` - Business rule task

### Subprocess
- `SUBPROCESS` - Embedded subprocess
- `CALL_ACTIVITY` - Call activity

### Gateways
- `EXCLUSIVE_GATEWAY` - XOR gateway
- `INCLUSIVE_GATEWAY` - OR gateway
- `PARALLEL_GATEWAY` - AND gateway
- `EVENT_GATEWAY` - Event-based gateway
- `COMPLEX_GATEWAY` - Complex gateway

### Data
- `DATA_OBJECT` - Data object
- `DATA_STORE` - Data store

### Layout
- `POOL` - Pool (swimlane)
- `LANE` - Lane
- `GROUP` - Group/frame
- `TEXT_ANNOTATION` - Text annotation

---

## Edge Types

Supported edge types:

- `SEQUENCE_FLOW` - Normal sequence flow
- `CONDITIONAL_FLOW` - Conditional flow
- `DEFAULT_FLOW` - Default flow from gateway
- `MESSAGE_FLOW` - Message flow between pools
- `ASSOCIATION` - Association (dotted line)
- `DATA_ASSOCIATION` - Data association

---

## Path Types

Supported path rendering:

- `SMOOTH_STEP` - Smooth step (default)
- `BEZIER` - Bezier curve
- `STRAIGHT` - Straight line
- `STEP` - Step line

---

## Handle Positions

Supported handle positions:

- `TOP`
- `RIGHT`
- `BOTTOM`
- `LEFT`

---

## Error Responses

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Process clx123456 not found",
  "error": "Not Found"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["nodes must be an array", "processId is required"],
  "error": "Bad Request"
}
```

---

## Integration Example

### Frontend (React + ReactFlow)

```typescript
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

// Save flow
const saveFlow = useCallback(async () => {
  const { getNodes, getEdges } = useReactFlow();
  
  const response = await fetch('/processes/flow/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      processId: 'clx123456',
      nodes: getNodes().map(node => ({
        id: node.id,
        type: node.type.toUpperCase(),
        label: node.data.label,
        positionX: node.position.x,
        positionY: node.position.y,
        width: node.style?.width,
        height: node.style?.height,
        parentNodeId: node.parentNode,
        style: node.data.style,
      })),
      edges: getEdges().map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: edge.animated,
      })),
      changesLog: 'Updated process flow',
    }),
  });
  
  const result = await response.json();
  console.log(`Saved ${result.nodesCount} nodes, ${result.edgesCount} edges`);
}, [token]);

// Load flow
const loadFlow = useCallback(async (processId: string) => {
  const response = await fetch(`/processes/${processId}/flow`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const { nodes, edges, layout } = await response.json();
  
  setNodes(nodes);
  setEdges(edges);
  
  if (layout) {
    setViewport({
      x: layout.viewportX,
      y: layout.viewportY,
      zoom: layout.zoom,
    });
  }
}, [token]);
```

---

## Best Practices

1. **Save Frequently**: Auto-save every 30-60 seconds while editing
2. **Version Tracking**: Use `changesLog` to document changes
3. **Hierarchical Nodes**: Use `parentNodeId` for grouped nodes
4. **Z-Index Management**: Set groups to -1, children to 1000+
5. **Style Consistency**: Store all styles in `node.data.style` for proper rendering
6. **Error Handling**: Always check response status and handle errors gracefully

---

## Database Schema Reference

### Node Table
- Position: `positionX`, `positionY`
- Size: `width`, `height`, `zIndex`
- Style: `backgroundColor`, `borderColor`, `fontColor`, `fontSize`, etc.
- Hierarchy: `parentNodeId`, `groupId`
- Custom: `style` (JSON), `data` (JSON)

### Edge Table
- Connection: `fromId`, `toId`
- Style: `strokeColor`, `strokeWidth`, `strokeDasharray`
- Routing: `pathType`, `sourceHandle`, `targetHandle`
- Custom: `style` (JSON), `metadata` (JSON)

### ProcessVersion Table
- Links to: `Process` (many-to-one)
- Has: `nodes` (one-to-many), `edges` (one-to-many), `layout` (one-to-one)
- Versioning: `version` (integer), `status` (enum)
