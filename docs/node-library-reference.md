# Node Library Quick Reference

## Complete Node Type Mapping

This document provides a quick reference for all 150+ nodes available in the Flow Builder palette.

## Node Type to Component Mapping

| Palette Type | Component Name | Category | Shape | Color | Icon |
|-------------|----------------|----------|-------|-------|------|
| `startEvent` | StartEventNode | Events | circle | green | Play |
| `endEvent` | EndEventNode | Events | circle | red | StopCircle |
| `intermediateEvent` | IntermediateEventNode | Events | circle | blue | Circle |
| `timerEvent` | TimerEventNode | Events | circle | yellow | Clock |
| `messageEvent` | MessageEventNode | Events | circle | blue | Mail |
| `errorEvent` | ErrorEventNode | Events | circle | red | AlertCircle |
| `signalEvent` | SignalEventNode | Events | circle | purple | Radio |
| `cancelEvent` | CancelEventNode | Events | circle | red | XCircle |
| `escalationEvent` | EscalationEventNode | Events | circle | orange | TrendingUp |
| `notificationEvent` | NotificationEventNode | Events | circle | yellow | Bell |
| `task` | TaskNode | Tasks | rounded-rectangle | blue | CheckSquare |
| `userTask` | UserTaskNode | Tasks | rounded-rectangle | blue | User |
| `serviceTask` | ServiceTaskNode | Tasks | rounded-rectangle | purple | Cog |
| `manualTask` | ManualTaskNode | Tasks | rounded-rectangle | green | Hand |
| `scriptTask` | ScriptTaskNode | Tasks | rounded-rectangle | purple | Code |
| `sendTask` | SendTaskNode | Tasks | rounded-rectangle | blue | Send |
| `receiveTask` | ReceiveTaskNode | Tasks | rounded-rectangle | blue | Inbox |
| `businessTask` | BusinessTaskNode | Tasks | rounded-rectangle | orange | Briefcase |
| `processTask` | ProcessTaskNode | Tasks | rounded-rectangle | blue | GitBranch |
| `loopTask` | LoopTaskNode | Tasks | rounded-rectangle | purple | Repeat |
| `gateway` | GatewayNode | Gateways | diamond | yellow | GitMerge |
| `exclusiveGateway` | ExclusiveGatewayNode | Gateways | diamond | yellow | GitMerge |
| `parallelGateway` | ParallelGatewayNode | Gateways | diamond | green | GitBranch |
| `eventBasedGateway` | EventBasedGatewayNode | Gateways | diamond | purple | Zap |
| `inclusiveGateway` | InclusiveGatewayNode | Gateways | diamond | blue | GitCommit |
| `complexGateway` | ComplexGatewayNode | Gateways | diamond | red | Network |
| `process` | ProcessNode | Processes | rounded-rectangle | blue | Box |
| `loopProcess` | LoopProcessNode | Processes | rounded-rectangle | purple | Repeat |
| `multiInstanceProcess` | MultiInstanceProcessNode | Processes | rounded-rectangle | blue | Layers |
| `transactionProcess` | TransactionProcessNode | Processes | rounded-rectangle | orange | DollarSign |
| `adHocProcess` | AdHocProcessNode | Processes | rounded-rectangle | gray | Shuffle |
| `database` | DatabaseNode | Data | rounded-rectangle | blue | Database |
| `storage` | StorageNode | Data | rounded-rectangle | blue | HardDrive |
| `server` | ServerNode | Data | rounded-rectangle | purple | Server |
| `cloudStorage` | CloudStorageNode | Data | rounded-rectangle | blue | Cloud |
| `archive` | ArchiveNode | Data | rounded-rectangle | gray | Archive |
| `fileSystem` | FileSystemNode | Data | rounded-rectangle | yellow | FolderOpen |
| `dataStore` | DataStoreNode | Data | rounded-rectangle | blue | Save |
| `dataObject` | DataObjectNode | Data | rounded-rectangle | green | FileText |
| `apiCall` | ApiCallNode | Integration | rounded-rectangle | purple | Zap |
| `webService` | WebServiceNode | Integration | rounded-rectangle | blue | Globe |
| `restApi` | RestApiNode | Integration | rounded-rectangle | green | Link |
| `soapApi` | SoapApiNode | Integration | rounded-rectangle | orange | Link2 |
| `webSocket` | WebSocketNode | Integration | rounded-rectangle | purple | Radio |
| `integration` | IntegrationNode | Integration | rounded-rectangle | blue | Share2 |
| `webhook` | WebhookNode | Integration | rounded-rectangle | yellow | Webhook |
| `upload` | UploadNode | Integration | rounded-rectangle | green | Upload |
| `download` | DownloadNode | Integration | rounded-rectangle | blue | Download |
| `message` | MessageNode | Communication | rounded-rectangle | blue | MessageSquare |
| `chat` | ChatNode | Communication | rounded-rectangle | green | MessageCircle |
| `email` | EmailNode | Communication | rounded-rectangle | blue | Mail |
| `phoneCall` | PhoneCallNode | Communication | rounded-rectangle | green | Phone |
| `videoCall` | VideoCallNode | Communication | rounded-rectangle | purple | Video |
| `voiceMessage` | VoiceMessageNode | Communication | rounded-rectangle | orange | Mic |
| `notification` | NotificationNode | Communication | rounded-rectangle | yellow | Bell |
| `announcement` | AnnouncementNode | Communication | rounded-rectangle | red | Volume2 |
| `secureTask` | SecureTaskNode | Security | rounded-rectangle | orange | Lock |
| `unlock` | UnlockNode | Security | rounded-rectangle | green | Unlock |
| `authorization` | AuthorizationNode | Security | rounded-rectangle | orange | ShieldCheck |
| `authentication` | AuthenticationNode | Security | rounded-rectangle | orange | Key |
| `verifyUser` | VerifyUserNode | Security | rounded-rectangle | blue | UserCheck |
| `blockUser` | BlockUserNode | Security | rounded-rectangle | red | UserX |
| `shoppingCart` | ShoppingCartNode | Business | rounded-rectangle | green | ShoppingCart |
| `payment` | PaymentNode | Business | rounded-rectangle | green | CreditCard |
| `transaction` | TransactionNode | Business | rounded-rectangle | blue | DollarSign |
| `revenue` | RevenueNode | Business | rounded-rectangle | green | TrendingUp |
| `analytics` | AnalyticsNode | Business | rounded-rectangle | purple | BarChart |
| `report` | ReportNode | Business | rounded-rectangle | blue | FileText |
| `goal` | GoalNode | Business | rounded-rectangle | orange | Target |
| `achievement` | AchievementNode | Business | rounded-rectangle | yellow | Award |
| `product` | ProductNode | Business | rounded-rectangle | blue | Package |
| `delivery` | DeliveryNode | Business | rounded-rectangle | green | Truck |
| `document` | DocumentNode | Documents | rounded-rectangle | blue | FileText |
| `createFile` | CreateFileNode | Documents | rounded-rectangle | green | FilePlus |
| `deleteFile` | DeleteFileNode | Documents | rounded-rectangle | red | FileX |
| `verifyFile` | VerifyFileNode | Documents | rounded-rectangle | blue | FileCheck |
| `copy` | CopyNode | Documents | rounded-rectangle | blue | Copy |
| `clipboard` | ClipboardNode | Documents | rounded-rectangle | gray | Clipboard |
| `bookmark` | BookmarkNode | Documents | rounded-rectangle | yellow | Bookmark |
| `desktopView` | DesktopViewNode | UI | rounded-rectangle | blue | Monitor |
| `mobileView` | MobileViewNode | UI | rounded-rectangle | purple | Smartphone |
| `layout` | LayoutNode | UI | rounded-rectangle | gray | Layout |
| `textInput` | TextInputNode | UI | rounded-rectangle | blue | Type |
| `display` | DisplayNode | UI | rounded-rectangle | green | Eye |
| `hide` | HideNode | UI | rounded-rectangle | red | EyeOff |
| `image` | ImageNode | UI | rounded-rectangle | purple | Image |
| `camera` | CameraNode | UI | rounded-rectangle | blue | Camera |
| `location` | LocationNode | Location | rounded-rectangle | red | MapPin |
| `map` | MapNode | Location | rounded-rectangle | blue | Map |
| `navigation` | NavigationNode | Location | rounded-rectangle | green | Navigation |
| `direction` | DirectionNode | Location | rounded-rectangle | yellow | Compass |
| `checkpoint` | CheckpointNode | Location | rounded-rectangle | orange | Flag |
| `add` | AddNode | Operations | rounded-rectangle | green | Plus |
| `subtract` | SubtractNode | Operations | rounded-rectangle | red | Minus |
| `multiply` | MultiplyNode | Operations | rounded-rectangle | blue | X |
| `calculate` | CalculateNode | Operations | rounded-rectangle | purple | Calculator |
| `percentage` | PercentageNode | Operations | rounded-rectangle | orange | Percent |
| `search` | SearchNode | Operations | rounded-rectangle | blue | Search |
| `filter` | FilterNode | Operations | rounded-rectangle | purple | Filter |
| `delete` | DeleteNode | Operations | rounded-rectangle | red | Trash2 |
| `edit` | EditNode | Operations | rounded-rectangle | blue | Edit |
| `refresh` | RefreshNode | Operations | rounded-rectangle | green | RefreshCw |
| `success` | SuccessNode | Status | circle | green | CheckCircle |
| `error` | ErrorNode | Status | circle | red | XCircle |
| `info` | InfoNode | Status | circle | blue | Info |
| `warning` | WarningNode | Status | circle | yellow | AlertTriangle |
| `complete` | CompleteNode | Status | circle | green | Check |
| `failed` | FailedNode | Status | circle | red | X |
| `processing` | ProcessingNode | Status | circle | blue | Loader |
| `pending` | PendingNode | Status | circle | yellow | Clock |
| `conditional` | ConditionalNode | Custom | custom | yellow | GitMerge |

## Category Breakdown

### Events (10 nodes)
Start, End, Intermediate, Timer, Message, Error, Signal, Cancel, Escalation, Notification

### Tasks (10 nodes)
Task, User, Service, Manual, Script, Send, Receive, Business, Process, Loop

### Gateways (7 nodes)
Gateway, Exclusive, Parallel, Event-Based, Inclusive, Complex

### Processes (5 nodes)
Process, Loop, Multi-Instance, Transaction, Ad-Hoc

### Data & Storage (8 nodes)
Database, Storage, Server, Cloud, Archive, File System, Data Store, Data Object

### Integration (9 nodes)
API Call, Web Service, REST, SOAP, WebSocket, Integration, Webhook, Upload, Download

### Communication (8 nodes)
Message, Chat, Email, Phone, Video, Voice, Notification, Announcement

### Security (6 nodes)
Secure Task, Unlock, Authorization, Authentication, Verify User, Block User

### Business (10 nodes)
Shopping Cart, Payment, Transaction, Revenue, Analytics, Report, Goal, Achievement, Product, Delivery

### Documents (8 nodes)
Document, Create, Delete, Verify, Copy, Clipboard, Bookmark

### UI (8 nodes)
Desktop, Mobile, Layout, Text Input, Display, Hide, Image, Camera

### Location (5 nodes)
Location, Map, Navigation, Direction, Checkpoint

### Operations (10 nodes)
Add, Subtract, Multiply, Calculate, Percentage, Search, Filter, Delete, Edit, Refresh

### Status (8 nodes)
Success, Error, Info, Warning, Complete, Failed, Processing, Pending

## Usage Examples

### Creating a Process Flow

```typescript
// Add start event
const startNode = {
  id: '1',
  type: 'startEvent',
  position: { x: 100, y: 100 },
  data: { label: 'Start Process' }
}

// Add user task
const userTaskNode = {
  id: '2',
  type: 'userTask',
  position: { x: 300, y: 100 },
  data: { label: 'Review Document' }
}

// Add gateway
const gatewayNode = {
  id: '3',
  type: 'exclusiveGateway',
  position: { x: 500, y: 100 },
  data: { label: 'Approved?' }
}

// Add end event
const endNode = {
  id: '4',
  type: 'endEvent',
  position: { x: 700, y: 100 },
  data: { label: 'End' }
}
```

### Integration Flow

```typescript
// API call
const apiNode = {
  id: '1',
  type: 'restApi',
  position: { x: 100, y: 100 },
  data: { label: 'Fetch Data' }
}

// Process data
const processNode = {
  id: '2',
  type: 'serviceTask',
  position: { x: 300, y: 100 },
  data: { label: 'Transform Data' }
}

// Store in database
const dbNode = {
  id: '3',
  type: 'database',
  position: { x: 500, y: 100 },
  data: { label: 'Save to DB' }
}
```

### Communication Flow

```typescript
// Receive email
const emailNode = {
  id: '1',
  type: 'email',
  position: { x: 100, y: 100 },
  data: { label: 'Receive Email' }
}

// Send notification
const notifyNode = {
  id: '2',
  type: 'notification',
  position: { x: 300, y: 100 },
  data: { label: 'Notify User' }
}

// Make phone call
const phoneNode = {
  id: '3',
  type: 'phoneCall',
  position: { x: 500, y: 100 },
  data: { label: 'Call Customer' }
}
```

## Icon Reference

All icons are from **Lucide React** icon library. Common icons used:

- **Events**: Play, StopCircle, Circle, Clock, Bell
- **Tasks**: CheckSquare, User, Cog, Hand, Code
- **Gateways**: GitMerge, GitBranch, Zap, Network
- **Data**: Database, HardDrive, Server, Cloud, Archive
- **Integration**: Globe, Link, Radio, Share2, Upload
- **Communication**: MessageSquare, Mail, Phone, Video
- **Security**: Lock, Unlock, ShieldCheck, Key
- **Business**: ShoppingCart, CreditCard, TrendingUp, BarChart
- **Status**: CheckCircle, XCircle, Info, AlertTriangle

## Search Tips

- Search by **node name**: "email", "database", "gateway"
- Search by **category**: "security", "business", "communication"
- Search by **function**: "send", "receive", "store", "process"
- Partial matches work: "auth" finds "authentication", "authorization"

## Related Documentation

- [Advanced Palette Implementation](./advanced-palette-implementation.md)
- [Base Node Architecture](./base-node-architecture.md)
- [Flow Builder Component](./flow-builder-component.md)
