# Node Hierarchy Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              FlowBuilder Component                        │  │
│  │  - Multi-selection UI (Ctrl+Click)                        │  │
│  │  - Group/Ungroup buttons (Toolbar)                        │  │
│  │  - Hierarchical drag visualization                        │  │
│  │  - Auto-parenting on drag into groups                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                           │
│  ┌───────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │  GroupNode    │  │ useHierarchical  │  │ useMulti         ││
│  │  Component    │  │ Drag Hook        │  │ Selection Hook   ││
│  │               │  │                  │  │                  ││
│  │ - Resizable   │  │ - Drag handlers  │  │ - Ctrl+Click     ││
│  │ - Collapsible │  │ - Child tracking │  │ - Box select     ││
│  │ - Type icons  │  │ - Position sync  │  │ - Batch ops      ││
│  └───────────────┘  └──────────────────┘  └──────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                        │
│  ┌────────────────────────────────────────────────────────────┐│
│  │          HierarchyService (Read Operations)                ││
│  │                                                             ││
│  │  validateHierarchy()      getDescendants()                 ││
│  │  wouldCreateCircular()    getAncestors()                   ││
│  │  calculateLevel()         getSiblings()                    ││
│  │  getHierarchyStats()      buildTree()                      ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │        HierarchyOperations (Write Operations)              ││
│  │                                                             ││
│  │  setParent()              createGroup()                    ││
│  │  removeParent()           moveNodesToParent()              ││
│  │  toggleCollapse()         getNodesMovingWithParent()       ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                      │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                  FlowStore (Zustand)                        ││
│  │                                                             ││
│  │  State:                    Hierarchy Methods:               ││
│  │  - nodes: Node[]           - setNodeParent()                ││
│  │  - edges: Edge[]           - removeNodeParent()             ││
│  │  - selectedNodes           - createGroup()                  ││
│  │  - isDirty                 - moveNodesToGroup()             ││
│  │                            - toggleGroupCollapse()          ││
│  │  CRUD Methods:             - getNodeDescendants()           ││
│  │  - addNode()               - getNodeAncestors()             ││
│  │  - updateNode()            - getNodeSiblings()              ││
│  │  - deleteNode()            - getHierarchyStats()            ││
│  │  - addEdge()                                                ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                  ReactFlow Nodes & Edges                    ││
│  │                                                             ││
│  │  Node {                        NodeHierarchyData {          ││
│  │    id: string                    parentId?: string          ││
│  │    type: string                  childIds?: string[]        ││
│  │    position: XYPosition          level?: number             ││
│  │    data: NodeHierarchyData       isGroup?: boolean          ││
│  │  }                               groupType?: string         ││
│  │                                  collapsed?: boolean        ││
│  │                               }                             ││
│  └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Creating a Group

```
1. User selects nodes (Ctrl+Click in ReactFlow)
   ↓
2. User clicks "Group" button in Toolbar
   ↓
3. FlowBuilder.createGroup() called
   ↓
4. Calculates bounding box for selected nodes
   ↓
5. Creates GroupNode with:
   │
   ├─ Appropriate size (with padding)
   ├─ childIds array containing selected node IDs
   ├─ GroupType (category/subprocess/container/custom)
   └─ Initial position
   ↓
6. Updates child nodes:
   │
   ├─ Converts positions to relative coordinates
   ├─ Sets parentNode property to group ID
   ├─ Sets extent: 'parent' for containment
   └─ Adds parentId to node.data
   ↓
7. Triggers onNodesChange with all updated nodes
   ↓
8. ReactFlow re-renders
   ↓
9. GroupNode component displays with children inside
```

## Data Flow: Dragging Parent Node

```
1. User starts dragging node X
   ↓
2. onNodeDragStart triggered
   ↓
3. useHierarchicalDrag.handleNodeDragStart()
   │
   ├─ Calls HierarchyService.getDescendants(X)
   ├─ Stores initial positions of X and all descendants
   └─ Sets dragState.isDragging = true
   ↓
4. User moves mouse (dragging)
   ↓
5. onNodeDrag triggered repeatedly
   ↓
6. useHierarchicalDrag.handleNodeDrag()
   │
   ├─ Calculates delta from initial position
   ├─ Updates all descendant positions
   └─ Calls onNodesChange() for each child
   ↓
7. ReactFlow re-renders all affected nodes
   ↓
8. User releases mouse
   ↓
9. onNodeDragStop triggered
   ↓
10. useHierarchicalDrag.handleNodeDragStop()
    └─ Resets dragState
```

## Type System Hierarchy

```
Node (ReactFlow)
  └─ data: NodeHierarchyData
       │
       ├─ label: string
       ├─ description?: string
       │
       ├─ Hierarchy Properties:
       │   ├─ parentId?: string | null
       │   ├─ childIds?: string[]
       │   └─ level?: number
       │
       ├─ Grouping Properties:
       │   ├─ isGroup?: boolean
       │   ├─ groupType?: 'category' | 'subprocess' | 'container' | 'custom'
       │   └─ collapsed?: boolean
       │
       └─ metadata?: {
             color?: string
             icon?: string
             [key: string]: any
           }
```

## Validation Flow

```
Operation: setParent(childId, parentId)
  ↓
HierarchyService.validateHierarchy()
  │
  ├─ Check 1: Self-reference?
  │   ├─ childId === parentId?
  │   └─ ✗ Error: "Node cannot be its own parent"
  │
  ├─ Check 2: Circular dependency?
  │   ├─ wouldCreateCircular(nodes, parentId, childId)
  │   │   └─ Walk up parent chain
  │   └─ ✗ Error: "Would create circular dependency"
  │
  ├─ Check 3: Max depth exceeded?
  │   ├─ calculateLevel(parentId) >= MAX_DEPTH?
  │   └─ ✗ Error: "Maximum nesting depth exceeded"
  │
  └─ Check 4: Child has children? (warning)
      ├─ hasChildren(child)?
      └─ ⚠ Warning: "Moving this node will also move all its children"
  ↓
✓ Validation passed → Proceed with operation
✗ Validation failed → Throw error
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    FlowBuilder Component                      │
│                                                               │
│  ┌───────────────────┐              ┌──────────────────────┐│
│  │  Toolbar (Panel)  │              │  ReactFlow Canvas    ││
│  │  ┌─────────────┐  │              │                      ││
│  │  │ Group btn   │──┼──────────────┼──▶ createGroup()    ││
│  │  │ Ungroup btn │──┼──────────────┼──▶ ungroupSelected()││
│  │  └─────────────┘  │              │                      ││
│  └───────────────────┘              │  ┌────────────────┐  ││
│                                      │  │  Node (any)    │  ││
│  ┌───────────────────┐              │  └────────────────┘  ││
│  │ Drag Handlers     │              │  ┌────────────────┐  ││
│  │                   │              │  │  GroupNode     │  ││
│  │ onDragStart ──────┼──────────────┼─▶│  - children    │  ││
│  │   (hierarchical)  │              │  │  - resizable   │  ││
│  │                   │              │  └────────────────┘  ││
│  │ onDrag ───────────┼──────────────┼─▶ Move children      ││
│  │   (hierarchical)  │              │    with parent       ││
│  │                   │              │                      ││
│  │ onDragStop ───────┼──────────────┼─▶ Auto-parenting     ││
│  │   (auto-parent)   │              │    detection         ││
│  └───────────────────┘              └──────────────────────┘│
│                                                               │
│  Data Flow:                                                   │
│  User Action → Handler → onNodesChange → ReactFlow update   │
└──────────────────────────────────────────────────────────────┘

Key Features:
1. **Manual Grouping**: Toolbar buttons for explicit group creation
2. **Auto-parenting**: Dragging node into group makes it a child
3. **Hierarchical Drag**: Moving parent moves all children
4. **Multi-selection**: Ctrl+Click for selecting multiple nodes
```

## Service Responsibilities

```
┌──────────────────────────────────────────────────────────┐
│              HierarchyService (Pure Functions)            │
│                                                           │
│  Input: Current state (nodes)                            │
│  Output: Computed values, no side effects                │
│                                                           │
│  ✓ validateHierarchy()  - Returns validation result      │
│  ✓ getDescendants()     - Returns array of nodes         │
│  ✓ getAncestors()       - Returns array of nodes         │
│  ✓ calculateLevel()     - Returns number                 │
│  ✓ getHierarchyStats()  - Returns statistics object      │
│                                                           │
│  ✗ Does NOT modify state                                 │
│  ✗ Does NOT have side effects                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│           HierarchyOperations (Transformations)           │
│                                                           │
│  Input: Current state + operation parameters             │
│  Output: New state (immutable)                           │
│                                                           │
│  ✓ setParent()          - Returns updated nodes array    │
│  ✓ removeParent()       - Returns updated nodes array    │
│  ✓ createGroup()        - Returns updated nodes array    │
│  ✓ moveNodesToParent()  - Returns MoveNodesResult        │
│                                                           │
│  ✓ Uses HierarchyService for validation                  │
│  ✗ Does NOT mutate input                                 │
│  ✗ Does NOT access store directly                        │
└──────────────────────────────────────────────────────────┘
```

## Performance Optimization Points

```
1. Component Level
   ├─ GroupNode: React.memo() prevents unnecessary re-renders
   └─ Only re-renders when data or selected state changes

2. Drag Operations
   ├─ Map-based position storage (O(1) lookup)
   ├─ Batch node updates in single onNodesChange call
   └─ Ref-based drag state (no re-renders during drag)

3. Hierarchy Queries
   ├─ Descendants: Single traversal with early termination
   ├─ Ancestors: Walk up parent chain (typically < 5 iterations)
   └─ Stats: Single pass through nodes array

4. State Management
   ├─ Zustand: Minimal re-renders via selector optimization
   ├─ Immutable updates: Structural sharing
   └─ DevTools: Debug-only overhead
```

## File Dependencies

```
FlowBuilder.tsx (Main Component)
  ├─ imports GroupNode
  ├─ imports useHierarchicalDrag
  ├─ imports Toolbar
  ├─ imports all node types (100+ nodes)
  ├─ implements createGroup()
  ├─ implements ungroupSelected()
  └─ implements auto-parenting on drag

GroupNode.tsx
  └─ standalone, no internal dependencies

Toolbar.tsx
  ├─ imports UI components from @repo/ui
  └─ receives handler props from FlowBuilder

useHierarchicalDrag.ts
  ├─ imports HierarchyService
  └─ uses ReactFlow types

hierarchy.service.ts
  ├─ imports types from node-hierarchy.ts
  └─ no other dependencies (pure)

node-hierarchy.ts
  └─ standalone type definitions

FlowEditor.tsx (Legacy - being phased out)
  ├─ Was previous main component
  └─ Now delegates to FlowBuilder for features
```
