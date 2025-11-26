/**
 * Advanced Node Types for Comprehensive Flowchart Library
 * Contains specialized nodes for different business domains
 */

import { Position } from '@xyflow/react'
import { createNode } from './BaseNode'
import {
  Settings,
  Code,
  Send,
  Inbox,
  Briefcase,
  Activity,
  RefreshCw,
  HardDrive,
  Server,
  CloudRain,
  Archive,
  FolderOpen,
  Save,
  FileCheck,
  Link,
  Wifi,
  Radio,
  Cast,
  Zap,
  Upload,
  Download,
  MessageSquare,
  MessageCircle,
  Phone,
  Video,
  Mic,
  Volume2,
  Shield,
  Key,
  UserCheck,
  UserX,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart,
  PieChart,
  Target,
  Award,
  Package,
  Truck,
  FilePlus,
  FileX,
  Copy,
  Clipboard,
  Bookmark,
  Monitor,
  Smartphone,
  Layout,
  Type,
  Eye,
  EyeOff,
  Image,
  Camera,
  MapPin,
  Map,
  Navigation,
  Compass,
  Flag,
  Plus,
  Minus,
  Hash,
  Percent,
  Search,
  Filter,
  Trash2,
  Edit,
  Check,
  Info,
  AlertTriangle,
  Loader,
  Layers,
  Grid as GridIcon,
  Share2,
  Sliders,
  Repeat,
  Bell,
  Ban,
  Unlock,
  X,
  XCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'

// ============================================
// TASK VARIANTS
// ============================================

export const ManualTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#f1f5f9',
  borderColor: '#64748b',
  borderWidth: 2,
  icon: <Settings className="w-6 h-6" />,
  iconColor: '#64748b',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ScriptTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <Code className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const SendTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#3b82f6',
  borderWidth: 2,
  icon: <Send className="w-6 h-6" />,
  iconColor: '#3b82f6',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ReceiveTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e0e7ff',
  borderColor: '#6366f1',
  borderWidth: 2,
  icon: <Inbox className="w-6 h-6" />,
  iconColor: '#6366f1',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const BusinessTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fed7aa',
  borderColor: '#ea580c',
  borderWidth: 2,
  icon: <Briefcase className="w-6 h-6" />,
  iconColor: '#ea580c',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ProcessTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fecaca',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <Activity className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const LoopTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#ccfbf1',
  borderColor: '#0d9488',
  borderWidth: 2,
  icon: <RefreshCw className="w-6 h-6" />,
  iconColor: '#0d9488',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
    { type: 'source', position: Position.Bottom, id: 'loop' },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// EVENT VARIANTS
// ============================================

export const SignalEventNode = createNode({
  shape: 'circle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 3,
  icon: <Zap className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const CancelEventNode = createNode({
  shape: 'circle',
  backgroundColor: '#f3f4f6',
  borderColor: '#6b7280',
  borderWidth: 3,
  icon: <Ban className="w-6 h-6" />,
  iconColor: '#6b7280',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const EscalationEventNode = createNode({
  shape: 'circle',
  backgroundColor: '#fed7aa',
  borderColor: '#ea580c',
  borderWidth: 3,
  icon: <AlertTriangle className="w-6 h-6" />,
  iconColor: '#ea580c',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const NotificationEventNode = createNode({
  shape: 'circle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 3,
  icon: <Bell className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

// ============================================
// GATEWAY VARIANTS
// ============================================

export const ExclusiveGatewayNode = createNode({
  shape: 'diamond',
  backgroundColor: '#fed7aa',
  borderColor: '#ea580c',
  borderWidth: 3,
  icon: <X className="w-6 h-6" />,
  iconColor: '#ea580c',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Right, id: 'true' },
    { type: 'source', position: Position.Bottom, id: 'false' },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const ParallelGatewayNode = createNode({
  shape: 'diamond',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 3,
  icon: <Layers className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Right, id: 'branch1' },
    { type: 'source', position: Position.Bottom, id: 'branch2' },
    { type: 'source', position: Position.Left, id: 'branch3' },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const EventBasedGatewayNode = createNode({
  shape: 'diamond',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 3,
  icon: <Filter className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Right, id: 'event1' },
    { type: 'source', position: Position.Bottom, id: 'event2' },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const InclusiveGatewayNode = createNode({
  shape: 'diamond',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 3,
  icon: <Share2 className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Right, id: 'path1' },
    { type: 'source', position: Position.Bottom, id: 'path2' },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const ComplexGatewayNode = createNode({
  shape: 'diamond',
  backgroundColor: '#e0e7ff',
  borderColor: '#4f46e5',
  borderWidth: 3,
  icon: <Sliders className="w-6 h-6" />,
  iconColor: '#4f46e5',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Right, id: 'out1' },
    { type: 'source', position: Position.Bottom, id: 'out2' },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

// ============================================
// PROCESS VARIANTS
// ============================================

export const LoopProcessNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#7c3aed',
  borderWidth: 3,
  icon: <Repeat className="w-7 h-7" />,
  iconColor: '#7c3aed',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
    { type: 'source', position: Position.Bottom, id: 'loop' },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 150,
  minHeight: 100,
})

export const MultiInstanceProcessNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#ddd6fe',
  borderColor: '#6d28d9',
  borderWidth: 3,
  icon: <Layers className="w-7 h-7" />,
  iconColor: '#6d28d9',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 150,
  minHeight: 100,
})

export const TransactionProcessNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#ede9fe',
  borderColor: '#7c3aed',
  borderWidth: 3,
  icon: <Layout className="w-7 h-7" />,
  iconColor: '#7c3aed',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 150,
  minHeight: 100,
})

export const AdHocProcessNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fae8ff',
  borderColor: '#c026d3',
  borderWidth: 3,
  icon: <GridIcon className="w-7 h-7" />,
  iconColor: '#c026d3',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 150,
  minHeight: 100,
})

// ============================================
// DATA & STORAGE
// ============================================

export const StorageNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#f1f5f9',
  borderColor: '#475569',
  borderWidth: 2,
  icon: <HardDrive className="w-6 h-6" />,
  iconColor: '#475569',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Bottom },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 100,
  minHeight: 80,
})

export const ServerNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Server className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Bottom },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 100,
  minHeight: 80,
})

export const CloudStorageNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e0f2fe',
  borderColor: '#0284c7',
  borderWidth: 2,
  icon: <CloudRain className="w-6 h-6" />,
  iconColor: '#0284c7',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Bottom },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 100,
  minHeight: 80,
})

export const ArchiveNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fef3c7',
  borderColor: '#b45309',
  borderWidth: 2,
  icon: <Archive className="w-6 h-6" />,
  iconColor: '#b45309',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Bottom },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 100,
  minHeight: 80,
})

export const FileSystemNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fef9c3',
  borderColor: '#ca8a04',
  borderWidth: 2,
  icon: <FolderOpen className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Bottom },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 100,
  minHeight: 80,
})

export const DataStoreNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <Save className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Top },
    { type: 'source', position: Position.Bottom },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 100,
  minHeight: 80,
})

export const DataObjectNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#d1fae5',
  borderColor: '#059669',
  borderWidth: 2,
  icon: <FileCheck className="w-6 h-6" />,
  iconColor: '#059669',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 100,
  minHeight: 60,
})

// ============================================
// INTEGRATION & APIs
// ============================================

export const WebServiceNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Link className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const RestApiNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#cffafe',
  borderColor: '#0891b2',
  borderWidth: 2,
  icon: <Wifi className="w-6 h-6" />,
  iconColor: '#0891b2',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const SoapApiNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <Radio className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const WebSocketNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fce7f3',
  borderColor: '#db2777',
  borderWidth: 2,
  icon: <Cast className="w-6 h-6" />,
  iconColor: '#db2777',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const IntegrationNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#ccfbf1',
  borderColor: '#0d9488',
  borderWidth: 2,
  icon: <Share2 className="w-6 h-6" />,
  iconColor: '#0d9488',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const WebhookNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 2,
  icon: <Zap className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const UploadNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <Upload className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const DownloadNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Download className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// COMMUNICATION
// ============================================

export const MessageNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <MessageSquare className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ChatNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#cffafe',
  borderColor: '#0891b2',
  borderWidth: 2,
  icon: <MessageCircle className="w-6 h-6" />,
  iconColor: '#0891b2',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const PhoneCallNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <Phone className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const VideoCallNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <Video className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const VoiceMessageNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fed7aa',
  borderColor: '#ea580c',
  borderWidth: 2,
  icon: <Mic className="w-6 h-6" />,
  iconColor: '#ea580c',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const AnnouncementNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e0e7ff',
  borderColor: '#4f46e5',
  borderWidth: 2,
  icon: <Volume2 className="w-6 h-6" />,
  iconColor: '#4f46e5',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const EmailNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fecaca',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <MessageSquare className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// SECURITY
// ============================================

export const SecureTaskNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <Shield className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const UnlockNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <Unlock className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const AuthorizationNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Shield className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const AuthenticationNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 2,
  icon: <Key className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const VerifyUserNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <UserCheck className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const BlockUserNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <UserX className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// BUSINESS & COMMERCE
// ============================================

export const ShoppingCartNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <ShoppingCart className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const PaymentNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <CreditCard className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const TransactionNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#d1fae5',
  borderColor: '#059669',
  borderWidth: 2,
  icon: <DollarSign className="w-6 h-6" />,
  iconColor: '#059669',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const RevenueNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <TrendingUp className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const AnalyticsNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e0e7ff',
  borderColor: '#4f46e5',
  borderWidth: 2,
  icon: <BarChart className="w-6 h-6" />,
  iconColor: '#4f46e5',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ReportNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <PieChart className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const GoalNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <Target className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const AchievementNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 2,
  icon: <Award className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ProductNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fed7aa',
  borderColor: '#ea580c',
  borderWidth: 2,
  icon: <Package className="w-6 h-6" />,
  iconColor: '#ea580c',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const DeliveryNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Truck className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// DOCUMENTS & FILES
// ============================================

export const DocumentNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <FileCheck className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const CreateFileNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <FilePlus className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const DeleteFileNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <FileX className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const VerifyFileNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#d1fae5',
  borderColor: '#059669',
  borderWidth: 2,
  icon: <FileCheck className="w-6 h-6" />,
  iconColor: '#059669',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const CopyNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <Copy className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ClipboardNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#f1f5f9',
  borderColor: '#475569',
  borderWidth: 2,
  icon: <Clipboard className="w-6 h-6" />,
  iconColor: '#475569',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const BookmarkNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 2,
  icon: <Bookmark className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// UI & DISPLAY
// ============================================

export const DesktopViewNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#f1f5f9',
  borderColor: '#475569',
  borderWidth: 2,
  icon: <Monitor className="w-6 h-6" />,
  iconColor: '#475569',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const MobileViewNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Smartphone className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const LayoutNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <Layout className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const TextInputNode = createNode({
  shape: 'rectangle',
  backgroundColor: '#white',
  borderColor: '#ffffffff',
  borderWidth: 2,
  iconColor: '#6b7280',
  handles: [
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const DisplayNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Eye className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const HideNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e5e7eb',
  borderColor: '#6b7280',
  borderWidth: 2,
  icon: <EyeOff className="w-6 h-6" />,
  iconColor: '#6b7280',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const ImageNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fce7f3',
  borderColor: '#db2777',
  borderWidth: 2,
  icon: <Image className="w-6 h-6" />,
  iconColor: '#db2777',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const CameraNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <Camera className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// LOCATION & NAVIGATION
// ============================================

export const LocationNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <MapPin className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const MapNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <Map className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const NavigationNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Navigation className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const DirectionNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <Compass className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const CheckpointNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fed7aa',
  borderColor: '#ea580c',
  borderWidth: 2,
  icon: <Flag className="w-6 h-6" />,
  iconColor: '#ea580c',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// OPERATIONS
// ============================================

export const AddNode = createNode({
  shape: 'circle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 3,
  icon: <Plus className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const SubtractNode = createNode({
  shape: 'circle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 3,
  icon: <Minus className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const MultiplyNode = createNode({
  shape: 'circle',
  backgroundColor: '#e5e7eb',
  borderColor: '#6b7280',
  borderWidth: 3,
  icon: <X className="w-6 h-6" />,
  iconColor: '#6b7280',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const CalculateNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Hash className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const PercentageNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e9d5ff',
  borderColor: '#9333ea',
  borderWidth: 2,
  icon: <Percent className="w-6 h-6" />,
  iconColor: '#9333ea',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const SearchNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#cffafe',
  borderColor: '#0891b2',
  borderWidth: 2,
  icon: <Search className="w-6 h-6" />,
  iconColor: '#0891b2',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const FilterNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#e0e7ff',
  borderColor: '#4f46e5',
  borderWidth: 2,
  icon: <Filter className="w-6 h-6" />,
  iconColor: '#4f46e5',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const DeleteNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 2,
  icon: <Trash2 className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const EditNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 2,
  icon: <Edit className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

export const RefreshNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 2,
  icon: <RefreshCw className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})

// ============================================
// STATUS & FEEDBACK
// ============================================

export const SuccessNode = createNode({
  shape: 'circle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 3,
  icon: <Check className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const ErrorNode = createNode({
  shape: 'circle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 3,
  icon: <X className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const InfoNode = createNode({
  shape: 'circle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 3,
  icon: <Info className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const WarningNode = createNode({
  shape: 'circle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 3,
  icon: <AlertTriangle className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const CompleteNode = createNode({
  shape: 'circle',
  backgroundColor: '#dcfce7',
  borderColor: '#16a34a',
  borderWidth: 3,
  icon: <CheckCircle className="w-6 h-6" />,
  iconColor: '#16a34a',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const FailedNode = createNode({
  shape: 'circle',
  backgroundColor: '#fee2e2',
  borderColor: '#dc2626',
  borderWidth: 3,
  icon: <XCircle className="w-6 h-6" />,
  iconColor: '#dc2626',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const ProcessingNode = createNode({
  shape: 'circle',
  backgroundColor: '#dbeafe',
  borderColor: '#2563eb',
  borderWidth: 3,
  icon: <Loader className="w-6 h-6" />,
  iconColor: '#2563eb',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const PendingNode = createNode({
  shape: 'circle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 3,
  icon: <Clock className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'below',
  size: { width: 60, height: 60 },
})

export const NotificationNode = createNode({
  shape: 'rounded-rectangle',
  backgroundColor: '#fef3c7',
  borderColor: '#ca8a04',
  borderWidth: 2,
  icon: <Bell className="w-6 h-6" />,
  iconColor: '#ca8a04',
  handles: [
    { type: 'target', position: Position.Left },
    { type: 'source', position: Position.Right },
  ],
  showLabel: true,
  labelPosition: 'inside',
  resizable: true,
  minWidth: 120,
  minHeight: 60,
})
