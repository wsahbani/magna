// Example: Creating ReactFlow-compatible nodes with enhanced styling

import { NodeType, HandlePosition, IconPosition, NodeStatus } from '@prisma/client';

// Example 1: Create a stylized start event node
export const createStartEventNode = {
  type: NodeType.START_EVENT,
  label: 'Begin Process',
  description: 'Process initiation point',
  
  // ReactFlow positioning
  positionX: 100,
  positionY: 200,
  width: 80,
  height: 80,
  zIndex: 1,
  
  // Handle configuration
  sourcePosition: HandlePosition.RIGHT,
  targetPosition: HandlePosition.LEFT,
  isConnectable: true,
  isDraggable: true,
  isSelectable: true,
  
  // Custom styling
  backgroundColor: '#4caf50',
  borderColor: '#2e7d32',
  borderWidth: 4,
  borderRadius: 40, // Circular for events
  fontSize: 12,
  fontColor: '#ffffff',
  fontWeight: 'bold',
  opacity: 1.0,
  
  // Icon configuration
  icon: 'play_arrow',
  iconPosition: IconPosition.CENTER,
  iconSize: 24,
  iconColor: '#ffffff',
  
  // Conditional styling for interactions
  hoverStyle: {
    backgroundColor: '#66bb6a',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
  },
  selectedStyle: {
    borderColor: '#1b5e20',
    borderWidth: 6,
  },
  
  // Animation
  animation: 'pulse',
  animationDuration: 2000,
  transition: 'all 0.3s ease-in-out',
  
  // Business logic
  isRequired: true,
  estimatedDuration: 5, // 5 minutes
  status: NodeStatus.ACTIVE,
  
  // Metadata
  tags: ['start', 'event', 'process-initiation'],
  metadata: {
    processType: 'customer-onboarding',
    priority: 'high',
    department: 'customer-service',
  },
};

// Example 2: Create a complex task node with validation
export const createValidationTaskNode = {
  type: NodeType.USER_TASK,
  label: 'Validate Documents',
  description: 'Review and validate customer documentation',
  
  // Positioning
  positionX: 300,
  positionY: 200,
  width: 180,
  height: 100,
  
  // Enhanced styling
  backgroundColor: '#ffffff',
  borderColor: '#ff6900', // Orange brand color
  borderWidth: 2,
  borderRadius: 8,
  fontSize: 14,
  fontColor: '#333333',
  
  // Icon
  icon: 'document_scanner',
  iconPosition: IconPosition.LEFT,
  iconSize: 20,
  iconColor: '#ff6900',
  
  // Conditional states
  hoverStyle: {
    backgroundColor: '#fff3e0',
    borderColor: '#e65100',
    cursor: 'pointer',
  },
  selectedStyle: {
    backgroundColor: '#ffe0b2',
    borderColor: '#bf360c',
    borderWidth: 3,
  },
  errorStyle: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 3,
    animation: 'shake',
  },
  
  // Business rules
  validationRules: {
    required: ['document-upload', 'signature'],
    timeout: 1800, // 30 minutes
    assignmentRules: {
      role: 'document-validator',
      skillLevel: 'intermediate',
    },
  },
  businessRules: {
    escalation: {
      timeout: 3600, // 1 hour
      escalateTo: 'supervisor',
    },
    approval: {
      required: true,
      threshold: 0.8,
    },
  },
  
  // Performance tracking
  estimatedDuration: 15, // 15 minutes
  slaTime: 30, // 30 minutes SLA
  
  // Status and metadata
  status: NodeStatus.PENDING,
  tags: ['validation', 'user-task', 'documents'],
  data: {
    formFields: ['documentType', 'validationStatus', 'notes'],
    validationCriteria: ['completeness', 'authenticity', 'compliance'],
  },
};

// Example 3: Create an exclusive gateway (decision point)
export const createDecisionGateway = {
  type: NodeType.EXCLUSIVE_GATEWAY,
  label: 'Valid?',
  description: 'Document validation decision point',
  
  // Diamond shape positioning
  positionX: 500,
  positionY: 220,
  width: 60,
  height: 60,
  
  // Gateway styling (diamond shape)
  backgroundColor: '#fff3e0',
  borderColor: '#f57c00',
  borderWidth: 3,
  borderRadius: 0, // Sharp corners for diamond
  
  // Custom transform for diamond shape
  style: {
    transform: 'rotate(45deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Icon
  icon: 'help',
  iconPosition: IconPosition.CENTER,
  iconSize: 16,
  iconColor: '#f57c00',
  
  // Gateway-specific properties
  isRequired: true,
  status: NodeStatus.ACTIVE,
  
  // Decision logic
  businessRules: {
    decisionType: 'exclusive',
    conditions: [
      {
        output: 'approved',
        condition: 'validationScore >= 0.8',
        priority: 1,
      },
      {
        output: 'rejected',
        condition: 'validationScore < 0.8',
        priority: 2,
        isDefault: true,
      },
    ],
  },
  
  tags: ['gateway', 'decision', 'validation'],
};

// Example 4: Edge configuration for connecting nodes
export const createConditionalEdge = {
  type: 'CONDITIONAL_FLOW',
  label: 'Approved',
  
  // ReactFlow styling
  animated: true,
  strokeColor: '#4caf50',
  strokeWidth: 3,
  strokeDasharray: null, // Solid line
  
  // Markers
  markerEnd: 'arrowclosed',
  markerSize: 24,
  
  // Label styling
  labelStyle: {
    fill: '#4caf50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  labelShowBg: true,
  labelBgStyle: {
    fill: '#e8f5e8',
    stroke: '#4caf50',
    strokeWidth: 1,
  },
  labelBgPadding: { x: 8, y: 4 },
  labelBgBorderRadius: 4,
  
  // Path configuration
  pathType: 'SMOOTH_STEP',
  
  // Business logic
  condition: 'validationScore >= 0.8',
  priority: 1,
  probability: 0.85, // 85% of cases go this route
  
  // Performance
  estimatedTime: 2, // 2 minutes transition
  
  // Metadata
  status: 'ACTIVE',
  tags: ['approval', 'conditional'],
  metadata: {
    businessRule: 'auto-approval-threshold',
    auditRequired: true,
  },
};

// Example 5: Process layout configuration
export const createProcessLayout = {
  // Viewport settings
  viewportX: 0,
  viewportY: 0,
  viewportZoom: 1.0,
  
  // Layout algorithm
  layoutDirection: 'LEFT_TO_RIGHT',
  nodeSpacing: 80,
  rankSpacing: 150,
  
  // Grid
  snapToGrid: true,
  gridSize: 20,
  showGrid: true,
  
  // UI components
  showMinimap: true,
  minimapPosition: 'BOTTOM_RIGHT',
  showControls: true,
  controlsPosition: 'BOTTOM_LEFT',
  
  // Background
  backgroundType: 'DOTS',
  backgroundColor: '#fafafa',
  
  // Auto-layout
  autoLayout: true,
  layoutAlgorithm: 'dagre',
  
  // Custom settings
  customSettings: {
    enableKeyboardShortcuts: true,
    enableContextMenu: true,
    enableNodeGrouping: true,
    enableEdgeSmoothing: true,
    highlightConnectedEdges: true,
  },
};

// Example 6: Node template for quick creation
export const taskNodeTemplate = {
  name: 'Orange Task Template',
  description: 'Standard task template with Orange branding',
  category: 'basic',
  nodeType: NodeType.TASK,
  
  defaultStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#ff6900',
    borderWidth: 2,
    borderRadius: 8,
    padding: '12px',
    fontSize: 14,
    fontColor: '#333333',
    fontFamily: "'Orange Helvetica', Arial, sans-serif",
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  defaultSize: { 
    width: 160, 
    height: 80 
  },
  
  icon: 'task_alt',
  thumbnail: '/templates/task-template.png',
  
  isCustom: false,
  isPublic: true,
};

export { 
  NodeType, 
  HandlePosition, 
  IconPosition, 
  NodeStatus 
};