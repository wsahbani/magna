import { Heading1, BodySmall } from '@repo/ui'
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
      className="group relative flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 border-gray-200 bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100/50 hover:border-orange-400 hover:shadow-md cursor-move transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]"
      title={label}
    >
      {/* Icon container with background */}
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-50 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-200">
        <div className="group-hover:scale-110 transition-transform duration-200 scale-100">
          {icon}
        </div>
      </div>
      {/* Label */}
      <BodySmall className="text-[8px] font-medium text-gray-700 group-hover:text-orange-700 text-center leading-tight truncate w-full transition-colors">
        {label}
      </BodySmall>
      {/* Drag indicator */}
      <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 rounded-full bg-orange-500"></div>
      </div>
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
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border-b-2 border-transparent hover:border-orange-300 transition-all duration-200 rounded-t-lg group"
      >
        <BodySmall className="text-[8px] font-bold text-gray-700 uppercase tracking-wider group-hover:text-orange-700 transition-colors">
          {title}
        </BodySmall>
        <ChevronDown 
          className={`w-3 h-3 text-gray-500 group-hover:text-orange-600 transition-all duration-200 ${
            isExpanded ? 'rotate-0' : '-rotate-90'
          }`} 
        />
      </button>
      {isExpanded && (
        <div className="grid grid-cols-2 gap-1.5 px-2 py-2 bg-gray-50/50 rounded-b-lg border-x border-b border-gray-200">
          {children}
        </div>
      )}
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with gradient */}
      <div className="px-3 py-3 border-b-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 sticky top-0 z-10 shadow-sm">
        {/* Title */}
        <div className="mb-3">
          <Heading1 className="text-sm font-bold text-gray-900 mb-0.5">{title}</Heading1>
          <BodySmall className="text-[8px] text-gray-500">
            Glissez-déposez les éléments sur le canvas
          </BodySmall>
        </div>
        
        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un nœud..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-xs border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors p-0.5 rounded hover:bg-orange-50"
              aria-label="Effacer la recherche"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        {/* Stats badge */}
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-[8px] font-semibold">
            {filteredNodes.length} {filteredNodes.length === 1 ? 'élément' : 'éléments'}
          </div>
          {searchQuery && (
            <BodySmall className="text-[8px] text-gray-500">
              pour "{searchQuery}"
            </BodySmall>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <PaletteSection 
            key={category} 
            title={`${category} (${nodes.length})`}
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
        
        {filteredNodes.length === 0 && (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <BodySmall className="text-gray-500 font-medium text-[8px]">
              Aucun résultat trouvé
            </BodySmall>
            <BodySmall className="text-gray-400 text-[8px] mt-1">
              Essayez avec d'autres mots-clés
            </BodySmall>
          </div>
        )}
      </div>
    </div>
  )
}
