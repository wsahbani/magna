import { Heading1, BodySmall } from '@repo/ui'
import { 
  Play, 
  Square, 
  CheckSquare, 
  GitBranch, 
  Box, 
  Circle,
  Clock,
  Mail,
  AlertCircle,
  Users,
  FileText,
  Database,
  Globe,
  HelpCircle,
  Zap,
  Ban,
  Settings,
  Code,
  Send,
  Inbox,
  Archive,
  Bookmark,
  CloudRain,
  Server,
  HardDrive,
  Monitor,
  Smartphone,
  Package,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart,
  PieChart,
  Target,
  Award,
  Flag,
  MapPin,
  Navigation,
  Compass,
  Map,
  FileCheck,
  FilePlus,
  FileX,
  FolderOpen,
  Save,
  Upload,
  Download,
  Share2,
  Link,
  MessageSquare,
  MessageCircle,
  Phone,
  Video,
  Mic,
  Volume2,
  Bell,
  Lock,
  Unlock,
  Shield,
  Key,
  UserCheck,
  UserX,
  Briefcase,
  Truck,
  Search,
  Filter,
  Sliders,
  RefreshCw,
  Repeat,
  Copy,
  Clipboard,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ChevronDown,
  Activity,
  Layers,
  Layout,
  Grid,
  Type,
  Hash,
  Percent,
  Plus,
  Minus,
  X,
  Check,
  Info,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Loader,
  Wifi,
  Radio,
  Cast,
  Camera,
  Image,
  FolderPlus,
} from 'lucide-react'
import { useState } from 'react'

interface PaletteItemProps {
  icon: React.ReactNode
  label: string
  nodeType: string
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}

function PaletteItem({ icon, label, nodeType, onDragStart }: PaletteItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, nodeType)}
      className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 hover:border-orange-400 cursor-move transition-all group"
      title={label}
    >
      <div className="flex-shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
      <BodySmall className="text-xs truncate flex-1">{label}</BodySmall>
    </div>
  )
}

interface PaletteSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

function PaletteSection({ title, children, defaultExpanded = true }: PaletteSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-orange-100 transition-colors group"
      >
        <BodySmall className="text-xs font-semibold text-gray-700 uppercase">
          {title}
        </BodySmall>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-all ${
            isExpanded ? 'rotate-0' : '-rotate-90'
          }`} 
        />
      </button>
      {isExpanded && (
        <div className="grid grid-cols-2 gap-1.5 px-4 mt-2">
          {children}
        </div>
      )}
    </div>
  )
}

interface PaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}

export function Palette({ onDragStart }: PaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const allNodes = [
    // Events
    { category: 'Events', icon: <Play className="w-4 h-4 text-green-600" />, label: 'Start Event', type: 'startEvent' },
    { category: 'Events', icon: <Square className="w-4 h-4 text-red-600" />, label: 'End Event', type: 'endEvent' },
    { category: 'Events', icon: <Circle className="w-4 h-4 text-blue-600" />, label: 'Intermediate', type: 'intermediateEvent' },
    { category: 'Events', icon: <Clock className="w-4 h-4 text-amber-600" />, label: 'Timer Event', type: 'timerEvent' },
    { category: 'Events', icon: <Mail className="w-4 h-4 text-cyan-600" />, label: 'Message Event', type: 'messageEvent' },
    { category: 'Events', icon: <AlertCircle className="w-4 h-4 text-rose-600" />, label: 'Error Event', type: 'errorEvent' },
    { category: 'Events', icon: <Zap className="w-4 h-4 text-yellow-600" />, label: 'Signal Event', type: 'signalEvent' },
    { category: 'Events', icon: <Ban className="w-4 h-4 text-gray-600" />, label: 'Cancel Event', type: 'cancelEvent' },
    { category: 'Events', icon: <AlertTriangle className="w-4 h-4 text-orange-600" />, label: 'Escalation', type: 'escalationEvent' },
    { category: 'Events', icon: <Bell className="w-4 h-4 text-purple-600" />, label: 'Notification', type: 'notificationEvent' },
    
    // Tasks
    { category: 'Tasks', icon: <CheckSquare className="w-4 h-4 text-blue-600" />, label: 'Task', type: 'task' },
    { category: 'Tasks', icon: <Users className="w-4 h-4 text-blue-700" />, label: 'User Task', type: 'userTask' },
    { category: 'Tasks', icon: <FileText className="w-4 h-4 text-indigo-600" />, label: 'Service Task', type: 'serviceTask' },
    { category: 'Tasks', icon: <Settings className="w-4 h-4 text-slate-600" />, label: 'Manual Task', type: 'manualTask' },
    { category: 'Tasks', icon: <Code className="w-4 h-4 text-green-600" />, label: 'Script Task', type: 'scriptTask' },
    { category: 'Tasks', icon: <Send className="w-4 h-4 text-blue-500" />, label: 'Send Task', type: 'sendTask' },
    { category: 'Tasks', icon: <Inbox className="w-4 h-4 text-indigo-500" />, label: 'Receive Task', type: 'receiveTask' },
    { category: 'Tasks', icon: <Briefcase className="w-4 h-4 text-orange-600" />, label: 'Business Task', type: 'businessTask' },
    { category: 'Tasks', icon: <Activity className="w-4 h-4 text-red-600" />, label: 'Process Task', type: 'processTask' },
    { category: 'Tasks', icon: <RefreshCw className="w-4 h-4 text-teal-600" />, label: 'Loop Task', type: 'loopTask' },
    
    // Gateways & Decision
    { category: 'Gateways', icon: <GitBranch className="w-4 h-4 text-yellow-600" />, label: 'Gateway', type: 'gateway' },
    { category: 'Gateways', icon: <HelpCircle className="w-4 h-4 text-amber-600" />, label: 'Conditional', type: 'conditional' },
    { category: 'Gateways', icon: <GitBranch className="w-4 h-4 text-orange-600" />, label: 'Exclusive OR', type: 'exclusiveGateway' },
    { category: 'Gateways', icon: <Layers className="w-4 h-4 text-purple-600" />, label: 'Parallel', type: 'parallelGateway' },
    { category: 'Gateways', icon: <Filter className="w-4 h-4 text-blue-600" />, label: 'Event Based', type: 'eventBasedGateway' },
    { category: 'Gateways', icon: <Share2 className="w-4 h-4 text-green-600" />, label: 'Inclusive OR', type: 'inclusiveGateway' },
    { category: 'Gateways', icon: <Sliders className="w-4 h-4 text-indigo-600" />, label: 'Complex', type: 'complexGateway' },
    
    // Sub-Processes
    { category: 'Processes', icon: <Box className="w-4 h-4 text-purple-600" />, label: 'Sub-Process', type: 'process' },
    { category: 'Processes', icon: <Repeat className="w-4 h-4 text-purple-700" />, label: 'Loop Process', type: 'loopProcess' },
    { category: 'Processes', icon: <Layers className="w-4 h-4 text-purple-800" />, label: 'Multi-Instance', type: 'multiInstanceProcess' },
    { category: 'Processes', icon: <Layout className="w-4 h-4 text-violet-600" />, label: 'Transaction', type: 'transactionProcess' },
    { category: 'Processes', icon: <Grid className="w-4 h-4 text-fuchsia-600" />, label: 'Ad-hoc Process', type: 'adHocProcess' },
    { category: 'Processes', icon: <FolderPlus className="w-4 h-4 text-orange-600" />, label: 'Group', type: 'group' },
    
    // Data & Storage
    { category: 'Data', icon: <Database className="w-4 h-4 text-teal-600" />, label: 'Database', type: 'database' },
    { category: 'Data', icon: <HardDrive className="w-4 h-4 text-slate-600" />, label: 'Storage', type: 'storage' },
    { category: 'Data', icon: <Server className="w-4 h-4 text-blue-600" />, label: 'Server', type: 'server' },
    { category: 'Data', icon: <CloudRain className="w-4 h-4 text-sky-600" />, label: 'Cloud Storage', type: 'cloudStorage' },
    { category: 'Data', icon: <Archive className="w-4 h-4 text-amber-700" />, label: 'Archive', type: 'archive' },
    { category: 'Data', icon: <FolderOpen className="w-4 h-4 text-yellow-600" />, label: 'File System', type: 'fileSystem' },
    { category: 'Data', icon: <Save className="w-4 h-4 text-green-600" />, label: 'Data Store', type: 'dataStore' },
    { category: 'Data', icon: <FileCheck className="w-4 h-4 text-emerald-600" />, label: 'Data Object', type: 'dataObject' },
    
    // Integration & APIs
    { category: 'Integration', icon: <Globe className="w-4 h-4 text-indigo-600" />, label: 'API Call', type: 'apiCall' },
    { category: 'Integration', icon: <Link className="w-4 h-4 text-blue-600" />, label: 'Web Service', type: 'webService' },
    { category: 'Integration', icon: <Wifi className="w-4 h-4 text-cyan-600" />, label: 'REST API', type: 'restApi' },
    { category: 'Integration', icon: <Radio className="w-4 h-4 text-purple-600" />, label: 'SOAP API', type: 'soapApi' },
    { category: 'Integration', icon: <Cast className="w-4 h-4 text-pink-600" />, label: 'WebSocket', type: 'webSocket' },
    { category: 'Integration', icon: <Share2 className="w-4 h-4 text-teal-600" />, label: 'Integration', type: 'integration' },
    { category: 'Integration', icon: <Zap className="w-4 h-4 text-yellow-600" />, label: 'Webhook', type: 'webhook' },
    { category: 'Integration', icon: <Upload className="w-4 h-4 text-green-600" />, label: 'Upload', type: 'upload' },
    { category: 'Integration', icon: <Download className="w-4 h-4 text-blue-600" />, label: 'Download', type: 'download' },
    
    // Communication
    { category: 'Communication', icon: <MessageSquare className="w-4 h-4 text-blue-600" />, label: 'Message', type: 'message' },
    { category: 'Communication', icon: <MessageCircle className="w-4 h-4 text-cyan-600" />, label: 'Chat', type: 'chat' },
    { category: 'Communication', icon: <Mail className="w-4 h-4 text-red-600" />, label: 'Email', type: 'email' },
    { category: 'Communication', icon: <Phone className="w-4 h-4 text-green-600" />, label: 'Phone Call', type: 'phoneCall' },
    { category: 'Communication', icon: <Video className="w-4 h-4 text-purple-600" />, label: 'Video Call', type: 'videoCall' },
    { category: 'Communication', icon: <Mic className="w-4 h-4 text-orange-600" />, label: 'Voice Message', type: 'voiceMessage' },
    { category: 'Communication', icon: <Bell className="w-4 h-4 text-yellow-600" />, label: 'Notification', type: 'notification' },
    { category: 'Communication', icon: <Volume2 className="w-4 h-4 text-indigo-600" />, label: 'Announcement', type: 'announcement' },
    
    // Security
    { category: 'Security', icon: <Lock className="w-4 h-4 text-red-600" />, label: 'Secure Task', type: 'secureTask' },
    { category: 'Security', icon: <Unlock className="w-4 h-4 text-green-600" />, label: 'Unlock', type: 'unlock' },
    { category: 'Security', icon: <Shield className="w-4 h-4 text-blue-600" />, label: 'Authorization', type: 'authorization' },
    { category: 'Security', icon: <Key className="w-4 h-4 text-yellow-600" />, label: 'Authentication', type: 'authentication' },
    { category: 'Security', icon: <UserCheck className="w-4 h-4 text-green-600" />, label: 'Verify User', type: 'verifyUser' },
    { category: 'Security', icon: <UserX className="w-4 h-4 text-red-600" />, label: 'Block User', type: 'blockUser' },
    
    // Business & Commerce
    { category: 'Business', icon: <ShoppingCart className="w-4 h-4 text-green-600" />, label: 'Shopping Cart', type: 'shoppingCart' },
    { category: 'Business', icon: <CreditCard className="w-4 h-4 text-blue-600" />, label: 'Payment', type: 'payment' },
    { category: 'Business', icon: <DollarSign className="w-4 h-4 text-emerald-600" />, label: 'Transaction', type: 'transaction' },
    { category: 'Business', icon: <TrendingUp className="w-4 h-4 text-green-600" />, label: 'Revenue', type: 'revenue' },
    { category: 'Business', icon: <BarChart className="w-4 h-4 text-indigo-600" />, label: 'Analytics', type: 'analytics' },
    { category: 'Business', icon: <PieChart className="w-4 h-4 text-purple-600" />, label: 'Report', type: 'report' },
    { category: 'Business', icon: <Target className="w-4 h-4 text-red-600" />, label: 'Goal', type: 'goal' },
    { category: 'Business', icon: <Award className="w-4 h-4 text-yellow-600" />, label: 'Achievement', type: 'achievement' },
    { category: 'Business', icon: <Package className="w-4 h-4 text-orange-600" />, label: 'Product', type: 'product' },
    { category: 'Business', icon: <Truck className="w-4 h-4 text-blue-600" />, label: 'Delivery', type: 'delivery' },
    
    // Documents & Files
    { category: 'Documents', icon: <FileText className="w-4 h-4 text-blue-600" />, label: 'Document', type: 'document' },
    { category: 'Documents', icon: <FilePlus className="w-4 h-4 text-green-600" />, label: 'Create File', type: 'createFile' },
    { category: 'Documents', icon: <FileX className="w-4 h-4 text-red-600" />, label: 'Delete File', type: 'deleteFile' },
    { category: 'Documents', icon: <FileCheck className="w-4 h-4 text-emerald-600" />, label: 'Verify File', type: 'verifyFile' },
    { category: 'Documents', icon: <Copy className="w-4 h-4 text-purple-600" />, label: 'Copy', type: 'copy' },
    { category: 'Documents', icon: <Clipboard className="w-4 h-4 text-slate-600" />, label: 'Clipboard', type: 'clipboard' },
    { category: 'Documents', icon: <Bookmark className="w-4 h-4 text-yellow-600" />, label: 'Bookmark', type: 'bookmark' },
    { category: 'Documents', icon: <Archive className="w-4 h-4 text-amber-600" />, label: 'Archive', type: 'archive' },
    
    // UI & Display
    { category: 'UI', icon: <Monitor className="w-4 h-4 text-slate-600" />, label: 'Desktop View', type: 'desktopView' },
    { category: 'UI', icon: <Smartphone className="w-4 h-4 text-blue-600" />, label: 'Mobile View', type: 'mobileView' },
    { category: 'UI', icon: <Layout className="w-4 h-4 text-purple-600" />, label: 'Layout', type: 'layout' },
    { category: 'UI', icon: <Type className="w-4 h-4 text-gray-600" />, label: 'Text Input', type: 'textInput' },
    { category: 'UI', icon: <Eye className="w-4 h-4 text-blue-600" />, label: 'Display', type: 'display' },
    { category: 'UI', icon: <EyeOff className="w-4 h-4 text-gray-600" />, label: 'Hide', type: 'hide' },
    { category: 'UI', icon: <Image className="w-4 h-4 text-pink-600" />, label: 'Image', type: 'image' },
    { category: 'UI', icon: <Camera className="w-4 h-4 text-purple-600" />, label: 'Camera', type: 'camera' },
    
    // Location & Navigation
    { category: 'Location', icon: <MapPin className="w-4 h-4 text-red-600" />, label: 'Location', type: 'location' },
    { category: 'Location', icon: <Map className="w-4 h-4 text-green-600" />, label: 'Map', type: 'map' },
    { category: 'Location', icon: <Navigation className="w-4 h-4 text-blue-600" />, label: 'Navigation', type: 'navigation' },
    { category: 'Location', icon: <Compass className="w-4 h-4 text-purple-600" />, label: 'Direction', type: 'direction' },
    { category: 'Location', icon: <Flag className="w-4 h-4 text-orange-600" />, label: 'Checkpoint', type: 'checkpoint' },
    
    // Operations
    { category: 'Operations', icon: <Plus className="w-4 h-4 text-green-600" />, label: 'Add', type: 'add' },
    { category: 'Operations', icon: <Minus className="w-4 h-4 text-red-600" />, label: 'Subtract', type: 'subtract' },
    { category: 'Operations', icon: <X className="w-4 h-4 text-gray-600" />, label: 'Multiply', type: 'multiply' },
    { category: 'Operations', icon: <Hash className="w-4 h-4 text-blue-600" />, label: 'Calculate', type: 'calculate' },
    { category: 'Operations', icon: <Percent className="w-4 h-4 text-purple-600" />, label: 'Percentage', type: 'percentage' },
    { category: 'Operations', icon: <Search className="w-4 h-4 text-cyan-600" />, label: 'Search', type: 'search' },
    { category: 'Operations', icon: <Filter className="w-4 h-4 text-indigo-600" />, label: 'Filter', type: 'filter' },
    { category: 'Operations', icon: <Trash2 className="w-4 h-4 text-red-600" />, label: 'Delete', type: 'delete' },
    { category: 'Operations', icon: <Edit className="w-4 h-4 text-blue-600" />, label: 'Edit', type: 'edit' },
    { category: 'Operations', icon: <RefreshCw className="w-4 h-4 text-green-600" />, label: 'Refresh', type: 'refresh' },
    
    // Status & Feedback
    { category: 'Status', icon: <Check className="w-4 h-4 text-green-600" />, label: 'Success', type: 'success' },
    { category: 'Status', icon: <X className="w-4 h-4 text-red-600" />, label: 'Error', type: 'error' },
    { category: 'Status', icon: <Info className="w-4 h-4 text-blue-600" />, label: 'Info', type: 'info' },
    { category: 'Status', icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />, label: 'Warning', type: 'warning' },
    { category: 'Status', icon: <CheckCircle className="w-4 h-4 text-green-600" />, label: 'Complete', type: 'complete' },
    { category: 'Status', icon: <XCircle className="w-4 h-4 text-red-600" />, label: 'Failed', type: 'failed' },
    { category: 'Status', icon: <Loader className="w-4 h-4 text-blue-600" />, label: 'Processing', type: 'processing' },
    { category: 'Status', icon: <Clock className="w-4 h-4 text-amber-600" />, label: 'Pending', type: 'pending' },
  ]

  const filteredNodes = searchQuery
    ? allNodes.filter(node => 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allNodes

  const groupedNodes = filteredNodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = []
    }
    acc[node.category].push(node)
    return acc
  }, {} as Record<string, typeof allNodes>)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <Heading1 className="text-base mb-3">Node Library</Heading1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Stats */}
        <BodySmall className="text-xs text-gray-500 mt-2">
          {filteredNodes.length} nodes {searchQuery ? `found for "${searchQuery}"` : 'available'}
        </BodySmall>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-2">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <PaletteSection 
            key={category} 
            title={`${category} (${nodes.length})`}
            defaultExpanded={searchQuery ? true : ['Events', 'Tasks', 'Gateways'].includes(category)}
          >
            {nodes.map((node) => (
              <PaletteItem
                key={`${node.category}-${node.type}-${node.label}`}
                icon={node.icon}
                label={node.label}
                nodeType={node.type}
                onDragStart={onDragStart}
              />
            ))}
          </PaletteSection>
        ))}
        
        {filteredNodes.length === 0 && (
          <div className="text-center py-8 px-4">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <BodySmall className="text-gray-500">
              No nodes found matching "{searchQuery}"
            </BodySmall>
          </div>
        )}
      </div>
    </div>
  )
}
