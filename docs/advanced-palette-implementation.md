# Advanced Palette Implementation

## Overview

This document describes the implementation of an advanced node palette system for the Flow Builder, expanding from 14 basic nodes to **150+ specialized nodes** organized across 15 categories.

## Architecture

### Node Creation Pattern

All nodes follow the **BaseNode factory pattern** using the `createNode()` function:

```typescript
export const ExampleNode = createNode({
  shape: 'rectangle', // circle, rectangle, diamond, rounded-rectangle, custom
  backgroundColor: COLOR_SCHEMES.blue.background,
  borderColor: COLOR_SCHEMES.blue.border,
  borderWidth: 2,
  icon: IconComponent,
  iconColor: COLOR_SCHEMES.blue.icon,
  handles: ['top', 'bottom', 'left', 'right'],
  showLabel: true,
  labelPosition: 'bottom',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})
```

### Color Schemes

Nodes use predefined color schemes from `BaseNode.COLOR_SCHEMES`:
- **Green**: Success, valid, positive states
- **Red**: Errors, dangers, critical states
- **Blue**: Primary actions, data operations
- **Yellow**: Warnings, notifications, alerts
- **Purple**: Business logic, calculations
- **Orange**: Security, authentication
- **Gray**: Neutral, informational

### Node Shapes

Different shapes indicate different node purposes:
- **Circle**: Events, status indicators
- **Rectangle**: Tasks, operations, processes
- **Diamond**: Gateways, decision points
- **Rounded Rectangle**: Data, storage, communication

## Complete Node Library (150 Nodes)

### 1. Events (10 nodes)
- `StartEventNode` - Process start point
- `EndEventNode` - Process end point
- `IntermediateEventNode` - Mid-process event
- `TimerEventNode` - Time-based trigger
- `MessageEventNode` - Message trigger
- `ErrorEventNode` - Error handler
- `SignalEventNode` - Signal broadcast/receive
- `CancelEventNode` - Cancellation event
- `EscalationEventNode` - Escalation trigger
- `NotificationEventNode` - Notification event

### 2. Tasks (10 nodes)
- `TaskNode` - Generic task
- `UserTaskNode` - User interaction task
- `ServiceTaskNode` - Automated service task
- `ManualTaskNode` - Manual task
- `ScriptTaskNode` - Script execution
- `SendTaskNode` - Send operation
- `ReceiveTaskNode` - Receive operation
- `BusinessTaskNode` - Business rule task
- `ProcessTaskNode` - Subprocess task
- `LoopTaskNode` - Repeating task

### 3. Gateways (7 nodes)
- `GatewayNode` - Generic gateway
- `ExclusiveGatewayNode` - XOR decision
- `ParallelGatewayNode` - AND parallel split/join
- `EventBasedGatewayNode` - Event-driven routing
- `InclusiveGatewayNode` - OR decision
- `ComplexGatewayNode` - Complex routing logic

### 4. Processes (5 nodes)
- `ProcessNode` - Subprocess
- `LoopProcessNode` - Looping subprocess
- `MultiInstanceProcessNode` - Parallel instances
- `TransactionProcessNode` - Transactional subprocess
- `AdHocProcessNode` - Ad-hoc subprocess

### 5. Data & Storage (8 nodes)
- `DatabaseNode` - Database operations
- `StorageNode` - Storage operations
- `ServerNode` - Server interactions
- `CloudStorageNode` - Cloud storage
- `ArchiveNode` - Archive operations
- `FileSystemNode` - File system access
- `DataStoreNode` - Data store
- `DataObjectNode` - Data object reference

### 6. Integration (9 nodes)
- `ApiCallNode` - API call
- `WebServiceNode` - Web service call
- `RestApiNode` - REST API endpoint
- `SoapApiNode` - SOAP service
- `WebSocketNode` - WebSocket connection
- `IntegrationNode` - Generic integration
- `WebhookNode` - Webhook handler
- `UploadNode` - File upload
- `DownloadNode` - File download

### 7. Communication (8 nodes)
- `MessageNode` - Message send/receive
- `ChatNode` - Chat message
- `EmailNode` - Email send/receive
- `PhoneCallNode` - Phone call
- `VideoCallNode` - Video call
- `VoiceMessageNode` - Voice message
- `NotificationNode` - Notification
- `AnnouncementNode` - Announcement

### 8. Security (6 nodes)
- `SecureTaskNode` - Secured operation
- `UnlockNode` - Unlock operation
- `AuthorizationNode` - Authorization check
- `AuthenticationNode` - Authentication
- `VerifyUserNode` - User verification
- `BlockUserNode` - Block user

### 9. Business (10 nodes)
- `ShoppingCartNode` - Shopping cart
- `PaymentNode` - Payment processing
- `TransactionNode` - Transaction
- `RevenueNode` - Revenue tracking
- `AnalyticsNode` - Analytics
- `ReportNode` - Report generation
- `GoalNode` - Goal tracking
- `AchievementNode` - Achievement
- `ProductNode` - Product management
- `DeliveryNode` - Delivery operation

### 10. Documents (8 nodes)
- `DocumentNode` - Document handling
- `CreateFileNode` - File creation
- `DeleteFileNode` - File deletion
- `VerifyFileNode` - File verification
- `CopyNode` - Copy operation
- `ClipboardNode` - Clipboard operation
- `BookmarkNode` - Bookmark

### 11. UI (8 nodes)
- `DesktopViewNode` - Desktop view
- `MobileViewNode` - Mobile view
- `LayoutNode` - Layout management
- `TextInputNode` - Text input
- `DisplayNode` - Display operation
- `HideNode` - Hide operation
- `ImageNode` - Image handling
- `CameraNode` - Camera access

### 12. Location (5 nodes)
- `LocationNode` - Location tracking
- `MapNode` - Map display
- `NavigationNode` - Navigation
- `DirectionNode` - Direction
- `CheckpointNode` - Checkpoint

### 13. Operations (10 nodes)
- `AddNode` - Addition
- `SubtractNode` - Subtraction
- `MultiplyNode` - Multiplication
- `CalculateNode` - Calculation
- `PercentageNode` - Percentage
- `SearchNode` - Search operation
- `FilterNode` - Filter operation
- `DeleteNode` - Delete operation
- `EditNode` - Edit operation
- `RefreshNode` - Refresh operation

### 14. Status (8 nodes)
- `SuccessNode` - Success state
- `ErrorNode` - Error state
- `InfoNode` - Information
- `WarningNode` - Warning state
- `CompleteNode` - Completion
- `FailedNode` - Failure state
- `ProcessingNode` - Processing state
- `PendingNode` - Pending state

### 15. Custom (3 nodes)
- `ConditionalNode` - Custom conditional with render
- Additional custom nodes as needed

## Palette UI Features

### Search Functionality
- **Live filtering**: Searches across node labels in real-time
- **Category filtering**: Shows/hides categories based on matches
- **Result count**: Displays number of matching nodes
- **Clear button**: Quick reset of search

### Collapsible Sections
- **15 categories**: Each category can be expanded/collapsed independently
- **Persistent state**: Category states maintained during search
- **Visual indicators**: Chevron icons show expand/collapse state
- **Category counts**: Shows number of nodes per category

### Drag-and-Drop
- **Drag initiation**: Mouse down on palette item
- **Data transfer**: Node type and label passed to drop handler
- **Visual feedback**: Cursor changes during drag
- **Drop zones**: Canvas accepts dropped nodes

## File Structure

```
apps/web/src/components/FlowBuilder/
├── FlowBuilder.tsx          # Main flow editor component
├── Palette.tsx              # Advanced palette UI (150+ nodes)
├── nodes/
│   ├── index.ts             # Central export file (all 150 exports)
│   ├── BaseNode.tsx         # Node factory pattern
│   ├── BasicNodes.tsx       # Core BPMN nodes
│   ├── CustomNodes.tsx      # Nodes with custom render
│   └── AdvancedNodes.tsx    # All 150 advanced nodes
└── ...
```

## Registration Flow

1. **Node Definition** (`AdvancedNodes.tsx`):
   ```typescript
   export const EmailNode = createNode({ ... })
   ```

2. **Export** (`index.ts`):
   ```typescript
   export { EmailNode } from './AdvancedNodes'
   ```

3. **Import** (`FlowBuilder.tsx`):
   ```typescript
   import { EmailNode } from './nodes'
   ```

4. **Register** (`FlowBuilder.tsx`):
   ```typescript
   const nodeTypes: NodeTypes = {
     email: EmailNode,
     // ...
   }
   ```

5. **Palette Entry** (`Palette.tsx`):
   ```typescript
   { 
     category: 'Communication',
     icon: <Mail />,
     label: 'Email',
     type: 'email'
   }
   ```

## Usage

### Adding Nodes from Palette

1. **Search**: Type in search bar to filter nodes
2. **Browse**: Expand categories to see available nodes
3. **Drag**: Click and drag node from palette
4. **Drop**: Drop on canvas to create node instance

### Node Properties

All nodes support:
- **Resizing**: Drag resize handles
- **Styling**: Background color, border color, border width
- **Handles**: Connection points (top, bottom, left, right)
- **Labels**: Custom text labels
- **Icons**: Lucide React icons

### Dynamic Features

- **Handle positions**: Change connection point locations
- **Grid snapping**: Snap to grid for alignment
- **Helper lines**: Alignment guides during drag
- **Properties panel**: Visual style customization

## Best Practices

### Creating New Nodes

1. **Follow naming convention**: `[Purpose]Node` (e.g., `EmailNode`)
2. **Use appropriate shape**: Match shape to node purpose
3. **Choose color scheme**: Use semantic colors
4. **Add to category**: Organize in logical category
5. **Export in order**: Maintain alphabetical/categorical order
6. **Register in FlowBuilder**: Add to nodeTypes mapping
7. **Add palette entry**: Create draggable palette item

### Color Usage

- **Green**: Success states, valid operations
- **Red**: Errors, critical actions, deletions
- **Blue**: Primary operations, data handling
- **Yellow**: Warnings, notifications
- **Purple**: Business logic, calculations
- **Orange**: Security, authentication
- **Gray**: Neutral, informational

### Shape Selection

- **Circle**: For events and state indicators
- **Rectangle**: For tasks and operations
- **Diamond**: For decision points and gateways
- **Rounded Rectangle**: For data and communication

## Performance Considerations

- **Lazy loading**: Nodes only render when visible
- **Memoization**: BaseNode components are memoized
- **Virtual scrolling**: Palette uses virtual scrolling for 150+ items
- **Search optimization**: Debounced search for performance
- **Collapse state**: Only render expanded categories

## Future Enhancements

1. **Custom node templates**: Allow users to create custom node types
2. **Node library import/export**: Save and share node collections
3. **Category customization**: User-defined categories
4. **Icon library**: Extended icon selection
5. **Node variants**: Multiple visual variants per node type
6. **Keyboard shortcuts**: Quick node creation via keyboard

## Related Documentation

- [Flow Builder Component](./flow-builder-component.md)
- [Base Node Architecture](./base-node-architecture.md)
- [Flow Store](./flow-store.md)
- [ReactFlow Integration](./reactflow-integration.md)
- [Grid Helpers Feature](./grid-helpers-feature.md)
