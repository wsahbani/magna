import { ReactNode } from 'react'
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
  ChevronRight,
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
  GripVertical,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@repo/ui'

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
      className="group relative flex items-center gap-2.5 px-3 py-2 rounded-md bg-white border border-gray-100 hover:border-[#FF7900]/40 hover:bg-[#FFF5EB] cursor-grab active:cursor-grabbing transition-all duration-150 shadow-sm hover:shadow-md"
      title={label}
    >
      {/* Drag handle */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-1 top-1/2 -translate-y-1/2">
        <GripVertical className="w-3 h-3 text-gray-300" />
      </div>
      
      {/* Icon container */}
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 group-hover:bg-[#FF7900]/10 transition-colors ml-2">
        {icon}
      </div>
      
      {/* Label */}
      <span className="flex-1 text-xs font-medium text-gray-700 group-hover:text-[#FF7900] truncate transition-colors">
        {label}
      </span>
      
      {/* Hover indicator */}
      <div className="w-1.5 h-1.5 rounded-full bg-[#FF7900] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

interface PaletteSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: React.ReactNode
  count?: number
}

function PaletteSection({ title, children, defaultExpanded = true, icon, count }: PaletteSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  return (
    <div className="mb-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 transition-all duration-150 group",
          isExpanded 
            ? "bg-black text-white" 
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        )}
      >
        <ChevronRight 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isExpanded ? "rotate-90" : "rotate-0",
            isExpanded ? "text-[#FF7900]" : "text-gray-400 group-hover:text-gray-600"
          )} 
        />
        {icon && (
          <span className={cn(
            "transition-colors",
            isExpanded ? "text-[#FF7900]" : "text-gray-500"
          )}>
            {icon}
          </span>
        )}
        <span className={cn(
          "flex-1 text-left text-xs font-semibold uppercase tracking-wide",
          isExpanded ? "text-white" : "text-gray-700"
        )}>
          {title}
        </span>
        {count !== undefined && (
          <span className={cn(
            "px-1.5 py-0.5 text-[10px] font-bold rounded",
            isExpanded 
              ? "bg-[#FF7900] text-white" 
              : "bg-gray-200 text-gray-600"
          )}>
            {count}
          </span>
        )}
      </button>
      
      <div className={cn(
        "grid gap-1.5 overflow-hidden transition-all duration-200",
        isExpanded ? "grid-rows-[1fr] p-2 bg-gray-50/80" : "grid-rows-[0fr] p-0"
      )}>
        <div className="overflow-hidden">
          <div className="space-y-1.5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void
  allowedNodeTypes?: string[] // Optional filter for allowed node types
  customNodes?: Array<{ category: string; icon: ReactNode; label: string; type: string }> // Custom node definitions
  defaultExpandedCategories?: string[] // Categories to expand by default
  title?: string // Custom title for the palette
}

export function Palette({ 
  onDragStart, 
  allowedNodeTypes,
  customNodes,
  defaultExpandedCategories = ['Events', 'Tasks', 'Gateways'],
  title = 'Bibliothèque de nœuds'
}: PaletteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const allNodes = customNodes || [
    // Events
    { category: 'Events', icon: <Play className="w-5 h-5 text-green-600" />, label: 'Start Event', type: 'startEvent' },
    { category: 'Events', icon: <Square className="w-5 h-5 text-red-600" />, label: 'End Event', type: 'endEvent' },
    { category: 'Events', icon: <Circle className="w-5 h-5 text-blue-600" />, label: 'Intermediate', type: 'intermediateEvent' },
    { category: 'Events', icon: <Clock className="w-5 h-5 text-amber-600" />, label: 'Timer Event', type: 'timerEvent' },
    { category: 'Events', icon: <Mail className="w-5 h-5 text-cyan-600" />, label: 'Message Event', type: 'messageEvent' },
    { category: 'Events', icon: <AlertCircle className="w-5 h-5 text-rose-600" />, label: 'Error Event', type: 'errorEvent' },
    { category: 'Events', icon: <Zap className="w-5 h-5 text-yellow-600" />, label: 'Signal Event', type: 'signalEvent' },
    { category: 'Events', icon: <Ban className="w-5 h-5 text-gray-600" />, label: 'Cancel Event', type: 'cancelEvent' },
    { category: 'Events', icon: <AlertTriangle className="w-5 h-5 text-orange-600" />, label: 'Escalation', type: 'escalationEvent' },
    { category: 'Events', icon: <Bell className="w-5 h-5 text-purple-600" />, label: 'Notification', type: 'notificationEvent' },
    
    // Tasks
    { category: 'Tasks', icon: <CheckSquare className="w-5 h-5 text-blue-600" />, label: 'Task', type: 'task' },
    { category: 'Tasks', icon: <Users className="w-5 h-5 text-blue-700" />, label: 'User Task', type: 'userTask' },
    { category: 'Tasks', icon: <FileText className="w-5 h-5 text-indigo-600" />, label: 'Service Task', type: 'serviceTask' },
    { category: 'Tasks', icon: <Settings className="w-5 h-5 text-slate-600" />, label: 'Manual Task', type: 'manualTask' },
    { category: 'Tasks', icon: <Code className="w-5 h-5 text-green-600" />, label: 'Script Task', type: 'scriptTask' },
    { category: 'Tasks', icon: <Send className="w-5 h-5 text-blue-500" />, label: 'Send Task', type: 'sendTask' },
    { category: 'Tasks', icon: <Inbox className="w-5 h-5 text-indigo-500" />, label: 'Receive Task', type: 'receiveTask' },
    { category: 'Tasks', icon: <Briefcase className="w-5 h-5 text-orange-600" />, label: 'Business Task', type: 'businessTask' },
    { category: 'Tasks', icon: <Activity className="w-5 h-5 text-red-600" />, label: 'Process Task', type: 'processTask' },
    { category: 'Tasks', icon: <RefreshCw className="w-5 h-5 text-teal-600" />, label: 'Loop Task', type: 'loopTask' },
    
    // Gateways & Decision
    { category: 'Gateways', icon: <GitBranch className="w-5 h-5 text-yellow-600" />, label: 'Gateway', type: 'gateway' },
    { category: 'Gateways', icon: <HelpCircle className="w-5 h-5 text-amber-600" />, label: 'Conditional', type: 'conditional' },
    { category: 'Gateways', icon: <GitBranch className="w-5 h-5 text-orange-600" />, label: 'Exclusive OR', type: 'exclusiveGateway' },
    { category: 'Gateways', icon: <Layers className="w-5 h-5 text-purple-600" />, label: 'Parallel', type: 'parallelGateway' },
    { category: 'Gateways', icon: <Filter className="w-5 h-5 text-blue-600" />, label: 'Event Based', type: 'eventBasedGateway' },
    { category: 'Gateways', icon: <Share2 className="w-5 h-5 text-green-600" />, label: 'Inclusive OR', type: 'inclusiveGateway' },
    { category: 'Gateways', icon: <Sliders className="w-5 h-5 text-indigo-600" />, label: 'Complex', type: 'complexGateway' },
    
    // Sub-Processes
    { category: 'Processes', icon: <Box className="w-5 h-5 text-purple-600" />, label: 'Sub-Process', type: 'process' },
    { category: 'Processes', icon: <Repeat className="w-5 h-5 text-purple-700" />, label: 'Loop Process', type: 'loopProcess' },
    { category: 'Processes', icon: <Layers className="w-5 h-5 text-purple-800" />, label: 'Multi-Instance', type: 'multiInstanceProcess' },
    { category: 'Processes', icon: <Layout className="w-5 h-5 text-violet-600" />, label: 'Transaction', type: 'transactionProcess' },
    { category: 'Processes', icon: <Grid className="w-5 h-5 text-fuchsia-600" />, label: 'Ad-hoc Process', type: 'adHocProcess' },
    { category: 'Processes', icon: <FolderPlus className="w-5 h-5 text-orange-600" />, label: 'Group', type: 'group' },
    
    // Data & Storage
    { category: 'Data', icon: <Database className="w-5 h-5 text-teal-600" />, label: 'Database', type: 'database' },
    { category: 'Data', icon: <HardDrive className="w-5 h-5 text-slate-600" />, label: 'Storage', type: 'storage' },
    { category: 'Data', icon: <Server className="w-5 h-5 text-blue-600" />, label: 'Server', type: 'server' },
    { category: 'Data', icon: <CloudRain className="w-5 h-5 text-sky-600" />, label: 'Cloud Storage', type: 'cloudStorage' },
    { category: 'Data', icon: <Archive className="w-5 h-5 text-amber-700" />, label: 'Archive', type: 'archive' },
    { category: 'Data', icon: <FolderOpen className="w-5 h-5 text-yellow-600" />, label: 'File System', type: 'fileSystem' },
    { category: 'Data', icon: <Save className="w-5 h-5 text-green-600" />, label: 'Data Store', type: 'dataStore' },
    { category: 'Data', icon: <FileCheck className="w-5 h-5 text-emerald-600" />, label: 'Data Object', type: 'dataObject' },
    
    // Integration & APIs
    { category: 'Integration', icon: <Globe className="w-5 h-5 text-indigo-600" />, label: 'API Call', type: 'apiCall' },
    { category: 'Integration', icon: <Link className="w-5 h-5 text-blue-600" />, label: 'Web Service', type: 'webService' },
    { category: 'Integration', icon: <Wifi className="w-5 h-5 text-cyan-600" />, label: 'REST API', type: 'restApi' },
    { category: 'Integration', icon: <Radio className="w-5 h-5 text-purple-600" />, label: 'SOAP API', type: 'soapApi' },
    { category: 'Integration', icon: <Cast className="w-5 h-5 text-pink-600" />, label: 'WebSocket', type: 'webSocket' },
    { category: 'Integration', icon: <Share2 className="w-5 h-5 text-teal-600" />, label: 'Integration', type: 'integration' },
    { category: 'Integration', icon: <Zap className="w-5 h-5 text-yellow-600" />, label: 'Webhook', type: 'webhook' },
    { category: 'Integration', icon: <Upload className="w-5 h-5 text-green-600" />, label: 'Upload', type: 'upload' },
    { category: 'Integration', icon: <Download className="w-5 h-5 text-blue-600" />, label: 'Download', type: 'download' },
    
    // Communication
    { category: 'Communication', icon: <MessageSquare className="w-5 h-5 text-blue-600" />, label: 'Message', type: 'message' },
    { category: 'Communication', icon: <MessageCircle className="w-5 h-5 text-cyan-600" />, label: 'Chat', type: 'chat' },
    { category: 'Communication', icon: <Mail className="w-5 h-5 text-red-600" />, label: 'Email', type: 'email' },
    { category: 'Communication', icon: <Phone className="w-5 h-5 text-green-600" />, label: 'Phone Call', type: 'phoneCall' },
    { category: 'Communication', icon: <Video className="w-5 h-5 text-purple-600" />, label: 'Video Call', type: 'videoCall' },
    { category: 'Communication', icon: <Mic className="w-5 h-5 text-orange-600" />, label: 'Voice Message', type: 'voiceMessage' },
    { category: 'Communication', icon: <Bell className="w-5 h-5 text-yellow-600" />, label: 'Notification', type: 'notification' },
    { category: 'Communication', icon: <Volume2 className="w-5 h-5 text-indigo-600" />, label: 'Announcement', type: 'announcement' },
    
    // Security
    { category: 'Security', icon: <Lock className="w-5 h-5 text-red-600" />, label: 'Secure Task', type: 'secureTask' },
    { category: 'Security', icon: <Unlock className="w-5 h-5 text-green-600" />, label: 'Unlock', type: 'unlock' },
    { category: 'Security', icon: <Shield className="w-5 h-5 text-blue-600" />, label: 'Authorization', type: 'authorization' },
    { category: 'Security', icon: <Key className="w-5 h-5 text-yellow-600" />, label: 'Authentication', type: 'authentication' },
    { category: 'Security', icon: <UserCheck className="w-5 h-5 text-green-600" />, label: 'Verify User', type: 'verifyUser' },
    { category: 'Security', icon: <UserX className="w-5 h-5 text-red-600" />, label: 'Block User', type: 'blockUser' },
    
    // Business & Commerce
    { category: 'Business', icon: <ShoppingCart className="w-5 h-5 text-green-600" />, label: 'Shopping Cart', type: 'shoppingCart' },
    { category: 'Business', icon: <CreditCard className="w-5 h-5 text-blue-600" />, label: 'Payment', type: 'payment' },
    { category: 'Business', icon: <DollarSign className="w-5 h-5 text-emerald-600" />, label: 'Transaction', type: 'transaction' },
    { category: 'Business', icon: <TrendingUp className="w-5 h-5 text-green-600" />, label: 'Revenue', type: 'revenue' },
    { category: 'Business', icon: <BarChart className="w-5 h-5 text-indigo-600" />, label: 'Analytics', type: 'analytics' },
    { category: 'Business', icon: <PieChart className="w-5 h-5 text-purple-600" />, label: 'Report', type: 'report' },
    { category: 'Business', icon: <Target className="w-5 h-5 text-red-600" />, label: 'Goal', type: 'goal' },
    { category: 'Business', icon: <Award className="w-5 h-5 text-yellow-600" />, label: 'Achievement', type: 'achievement' },
    { category: 'Business', icon: <Package className="w-5 h-5 text-orange-600" />, label: 'Product', type: 'product' },
    { category: 'Business', icon: <Truck className="w-5 h-5 text-blue-600" />, label: 'Delivery', type: 'delivery' },
    
    // Documents & Files
    { category: 'Documents', icon: <FileText className="w-5 h-5 text-blue-600" />, label: 'Document', type: 'document' },
    { category: 'Documents', icon: <FilePlus className="w-5 h-5 text-green-600" />, label: 'Create File', type: 'createFile' },
    { category: 'Documents', icon: <FileX className="w-5 h-5 text-red-600" />, label: 'Delete File', type: 'deleteFile' },
    { category: 'Documents', icon: <FileCheck className="w-5 h-5 text-emerald-600" />, label: 'Verify File', type: 'verifyFile' },
    { category: 'Documents', icon: <Copy className="w-5 h-5 text-purple-600" />, label: 'Copy', type: 'copy' },
    { category: 'Documents', icon: <Clipboard className="w-5 h-5 text-slate-600" />, label: 'Clipboard', type: 'clipboard' },
    { category: 'Documents', icon: <Bookmark className="w-5 h-5 text-yellow-600" />, label: 'Bookmark', type: 'bookmark' },
    { category: 'Documents', icon: <Archive className="w-5 h-5 text-amber-600" />, label: 'Archive', type: 'archive' },
    
    // UI & Display
    { category: 'UI', icon: <Monitor className="w-5 h-5 text-slate-600" />, label: 'Desktop View', type: 'desktopView' },
    { category: 'UI', icon: <Smartphone className="w-5 h-5 text-blue-600" />, label: 'Mobile View', type: 'mobileView' },
    { category: 'UI', icon: <Layout className="w-5 h-5 text-purple-600" />, label: 'Layout', type: 'layout' },
    { category: 'UI', icon: <Type className="w-5 h-5 text-gray-600" />, label: 'Text Input', type: 'textInput' },
    { category: 'UI', icon: <Eye className="w-5 h-5 text-blue-600" />, label: 'Display', type: 'display' },
    { category: 'UI', icon: <EyeOff className="w-5 h-5 text-gray-600" />, label: 'Hide', type: 'hide' },
    { category: 'UI', icon: <Image className="w-5 h-5 text-pink-600" />, label: 'Image', type: 'image' },
    { category: 'UI', icon: <Camera className="w-5 h-5 text-purple-600" />, label: 'Camera', type: 'camera' },
    
    // Location & Navigation
    { category: 'Location', icon: <MapPin className="w-5 h-5 text-red-600" />, label: 'Location', type: 'location' },
    { category: 'Location', icon: <Map className="w-5 h-5 text-green-600" />, label: 'Map', type: 'map' },
    { category: 'Location', icon: <Navigation className="w-5 h-5 text-blue-600" />, label: 'Navigation', type: 'navigation' },
    { category: 'Location', icon: <Compass className="w-5 h-5 text-purple-600" />, label: 'Direction', type: 'direction' },
    { category: 'Location', icon: <Flag className="w-5 h-5 text-orange-600" />, label: 'Checkpoint', type: 'checkpoint' },
    
    // Operations
    { category: 'Operations', icon: <Plus className="w-5 h-5 text-green-600" />, label: 'Add', type: 'add' },
    { category: 'Operations', icon: <Minus className="w-5 h-5 text-red-600" />, label: 'Subtract', type: 'subtract' },
    { category: 'Operations', icon: <X className="w-5 h-5 text-gray-600" />, label: 'Multiply', type: 'multiply' },
    { category: 'Operations', icon: <Hash className="w-5 h-5 text-blue-600" />, label: 'Calculate', type: 'calculate' },
    { category: 'Operations', icon: <Percent className="w-5 h-5 text-purple-600" />, label: 'Percentage', type: 'percentage' },
    { category: 'Operations', icon: <Search className="w-5 h-5 text-cyan-600" />, label: 'Search', type: 'search' },
    { category: 'Operations', icon: <Filter className="w-5 h-5 text-indigo-600" />, label: 'Filter', type: 'filter' },
    { category: 'Operations', icon: <Trash2 className="w-5 h-5 text-red-600" />, label: 'Delete', type: 'delete' },
    { category: 'Operations', icon: <Edit className="w-5 h-5 text-blue-600" />, label: 'Edit', type: 'edit' },
    { category: 'Operations', icon: <RefreshCw className="w-5 h-5 text-green-600" />, label: 'Refresh', type: 'refresh' },
    
    // Status & Feedback
    { category: 'Status', icon: <Check className="w-5 h-5 text-green-600" />, label: 'Success', type: 'success' },
    { category: 'Status', icon: <X className="w-5 h-5 text-red-600" />, label: 'Error', type: 'error' },
    { category: 'Status', icon: <Info className="w-5 h-5 text-blue-600" />, label: 'Info', type: 'info' },
    { category: 'Status', icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />, label: 'Warning', type: 'warning' },
    { category: 'Status', icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: 'Complete', type: 'complete' },
    { category: 'Status', icon: <XCircle className="w-5 h-5 text-red-600" />, label: 'Failed', type: 'failed' },
    { category: 'Status', icon: <Loader className="w-5 h-5 text-blue-600" />, label: 'Processing', type: 'processing' },
    { category: 'Status', icon: <Clock className="w-5 h-5 text-amber-600" />, label: 'Pending', type: 'pending' },
  ]

  // Filter nodes by allowed types if provided
  const nodesFilteredByType = allowedNodeTypes && allowedNodeTypes.length > 0
    ? allNodes.filter(node => allowedNodeTypes.includes(node.type))
    : allNodes

  // Filter nodes by search query
  const filteredNodes = searchQuery
    ? nodesFilteredByType.filter(node => 
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nodesFilteredByType

  const groupedNodes = filteredNodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = []
    }
    acc[node.category].push(node as any)
    return acc
  }, {} as Record<string, Array<{ category: string; icon: ReactNode; label: string; type: string }>>)

  // Category icons mapping
  const categoryIcons: Record<string, React.ReactNode> = {
    Events: <Zap className="w-4 h-4" />,
    Tasks: <CheckSquare className="w-4 h-4" />,
    Gateways: <GitBranch className="w-4 h-4" />,
    Processes: <Box className="w-10 h-10" />,
    Data: <Database className="w-4 h-4" />,
    Integration: <Globe className="w-4 h-4" />,
    Communication: <MessageSquare className="w-4 h-4" />,
    Security: <Shield className="w-4 h-4" />,
    Business: <Briefcase className="w-4 h-4" />,
    Documents: <FileText className="w-4 h-4" />,
    UI: <Monitor className="w-4 h-4" />,
    Location: <MapPin className="w-4 h-4" />,
    Operations: <Settings className="w-4 h-4" />,
    Status: <Activity className="w-4 h-4" />,
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Orange Group Style */}
      <div className="px-4 py-4 bg-black sticky top-0 z-10">
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#FF7900] flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{title}</h2>
            <p className="text-[10px] text-gray-400">
              Drag & drop elements
            </p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm border-0 rounded-lg bg-gray-900 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7900] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF7900] transition-colors p-1 rounded-full hover:bg-gray-800"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        {/* Results count */}
        <div className="flex items-center justify-between mt-3 px-1">
          <span className="text-[10px] text-gray-500">
            {filteredNodes.length} {filteredNodes.length === 1 ? 'element' : 'elements'}
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] text-[#FF7900] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <PaletteSection 
            key={category} 
            title={category}
            icon={categoryIcons[category]}
            count={nodes.length}
            defaultExpanded={searchQuery ? true : defaultExpandedCategories.includes(category)}
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
        
        {/* Empty state */}
        {filteredNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              No results found
            </p>
            <p className="text-xs text-gray-500 text-center mb-4">
              Try searching with different keywords
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs font-medium text-white bg-[#FF7900] rounded-lg hover:bg-[#E66D00] transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] text-gray-500 text-center">
          Drag elements to the canvas to create your flow
        </p>
      </div>
    </div>
  )
}
