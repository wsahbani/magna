import apiClient from '../lib/base-api'
import { Node, Edge } from '@xyflow/react'

/**
 * Flow action types for tracking changes
 */
export enum FlowAction {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

/**
 * Flow-related API responses
 */
export interface SaveFlowResponse {
  versionId: string
  version: number
  nodesCount: number
  edgesCount: number
}

export interface LoadFlowResponse {
  processId: string
  versionId: string
  version: number
  status: string
  nodes: Node[]
  edges: Edge[]
}

/**
 * Flow persistence service
 */
export class FlowService {
  /**
   * Save flow diagram (nodes + edges) for a process
   * Supports action tracking (ADD/EDIT/DELETE)
   */
  static async saveFlow(
    processId: string, 
    nodes: Node[], 
    edges: Edge[], 
    changesLog?: string,
    deletedNodes?: Node[],
    deletedEdges?: Edge[]
  ): Promise<SaveFlowResponse> {
    // Combine current nodes/edges with deleted ones
    const allNodes = [...nodes, ...(deletedNodes || [])]
    const allEdges = [...edges, ...(deletedEdges || [])]

    const response = await apiClient.post('/processes/flow/save', {
      processId,
      nodes: allNodes.map(node => ({
        id: node.id,
        action: (node as any).action, // ADD, EDIT, or DELETE
        type: this.mapReactFlowNodeTypeToApi(node.type || 'task'),
        label: node.data?.label || 'Untitled',
        description: node.data?.description || '',
        positionX: node.position.x,
        positionY: node.position.y,
        width: node.width || node.style?.width || node.data?.width || 120,
        height: node.height || node.style?.height || node.data?.height || 80,
        zIndex: node.zIndex || node.data?.zIndex || 1,
        parentNodeId: node.parentId || null,
        groupId: node.data?.groupId || null,
        sourcePosition: node.sourcePosition?.toUpperCase() || 'RIGHT',
        targetPosition: node.targetPosition?.toUpperCase() || 'LEFT',
        isDraggable: node.draggable !== undefined ? node.draggable : true,
        isSelectable: node.selectable !== undefined ? node.selectable : true,
        isConnectable: node.connectable !== undefined ? node.connectable : true,
        // Style object - only include defined properties
        style: {
          ...((node.data?.style as any)?.backgroundColor && { backgroundColor: (node.data.style as any).backgroundColor }),
          ...((node.style as any)?.backgroundColor && { backgroundColor: (node.style as any).backgroundColor }),
          ...((node.data?.style as any)?.borderColor && { borderColor: (node.data.style as any).borderColor }),
          ...((node.style as any)?.borderColor && { borderColor: (node.style as any).borderColor }),
          ...((node.data?.style as any)?.borderWidth && { borderWidth: typeof (node.data.style as any).borderWidth === 'string' ? parseInt((node.data.style as any).borderWidth) : (node.data.style as any).borderWidth }),
          ...((node.style as any)?.borderWidth && { borderWidth: typeof (node.style as any).borderWidth === 'string' ? parseInt((node.style as any).borderWidth) : (node.style as any).borderWidth }),
          ...((node.data?.style as any)?.borderRadius && { borderRadius: typeof (node.data.style as any).borderRadius === 'string' ? parseInt((node.data.style as any).borderRadius) : (node.data.style as any).borderRadius }),
          ...((node.style as any)?.borderRadius && { borderRadius: typeof (node.style as any).borderRadius === 'string' ? parseInt((node.style as any).borderRadius) : (node.style as any).borderRadius }),
          ...((node.data?.style as any)?.color && { color: (node.data.style as any).color }),
          ...((node.style as any)?.color && { color: (node.style as any).color }),
          ...((node.data?.style as any)?.fontSize && { fontSize: typeof (node.data.style as any).fontSize === 'string' ? parseInt((node.data.style as any).fontSize) : (node.data.style as any).fontSize }),
          ...((node.style as any)?.fontSize && { fontSize: typeof (node.style as any).fontSize === 'string' ? parseInt((node.style as any).fontSize) : (node.style as any).fontSize }),
          ...((node.data?.style as any)?.fontWeight && { fontWeight: (node.data.style as any).fontWeight }),
          ...((node.style as any)?.fontWeight && { fontWeight: (node.style as any).fontWeight }),
          ...((node.data?.style as any)?.opacity !== undefined && { opacity: typeof (node.data.style as any).opacity === 'string' ? parseFloat((node.data.style as any).opacity) : (node.data.style as any).opacity }),
          ...((node.style as any)?.opacity !== undefined && { opacity: typeof (node.style as any).opacity === 'string' ? parseFloat((node.style as any).opacity) : (node.style as any).opacity }),
        } as any,
        data: node.data || {},
      })),
      edges: allEdges.map(edge => ({
        id: edge.id,
        action: (edge as any).action, // ADD, EDIT, or DELETE
        source: edge.source,
        target: edge.target,
        type: edge.type?.toUpperCase() || 'SEQUENCE_FLOW',
        label: edge.label || null,
        animated: edge.animated || false,
        pathType: this.mapEdgePathType(edge.type),
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null,
        // Style object - only include defined properties
        style: {
          ...((edge.style as any)?.stroke && { stroke: (edge.style as any).stroke }),
          ...((edge.style as any)?.strokeColor && { stroke: (edge.style as any).strokeColor }),
          ...((edge.style as any)?.strokeWidth !== undefined && { strokeWidth: typeof (edge.style as any).strokeWidth === 'string' ? parseFloat((edge.style as any).strokeWidth) : (edge.style as any).strokeWidth }),
          ...((edge.style as any)?.strokeDasharray && { strokeDasharray: (edge.style as any).strokeDasharray }),
        } as any,
        data: edge.data || {},
      })),
      changesLog: changesLog || 'Flow diagram updated',
    })
    return response.data
  }

  /**
   * Map ReactFlow node type to API node type
   */
  private static mapReactFlowNodeTypeToApi(reactFlowType: string): string {
    const typeMap: Record<string, string> = {
      // Events
      'startEvent': 'START_EVENT',
      'endEvent': 'END_EVENT',
      'intermediateEvent': 'INTERMEDIATE_EVENT',
      'timerEvent': 'TIMER_EVENT',
      'messageEvent': 'MESSAGE_EVENT',
      'errorEvent': 'ERROR_EVENT',
      'signalEvent': 'SIGNAL_EVENT',
      'cancelEvent': 'CANCEL_EVENT',
      'escalationEvent': 'ESCALATION_EVENT',
      'notificationEvent': 'NOTIFICATION_EVENT',
      
      // Tasks
      'task': 'TASK',
      'userTask': 'USER_TASK',
      'serviceTask': 'SERVICE_TASK',
      'manualTask': 'MANUAL_TASK',
      'scriptTask': 'SCRIPT_TASK',
      'sendTask': 'SEND_TASK',
      'receiveTask': 'RECEIVE_TASK',
      'businessTask': 'BUSINESS_RULE_TASK',
      'processTask': 'CALL_ACTIVITY',
      'loopTask': 'LOOP_TASK',
      
      // Gateways
      'gateway': 'EXCLUSIVE_GATEWAY',
      'exclusiveGateway': 'EXCLUSIVE_GATEWAY',
      'parallelGateway': 'PARALLEL_GATEWAY',
      'inclusiveGateway': 'INCLUSIVE_GATEWAY',
      'eventBasedGateway': 'EVENT_GATEWAY',
      'complexGateway': 'COMPLEX_GATEWAY',
      'conditional': 'CONDITIONAL',
      
      // Processes
      'process': 'SUBPROCESS',
      'loopProcess': 'LOOP_PROCESS',
      'multiInstanceProcess': 'MULTI_INSTANCE_PROCESS',
      'transactionProcess': 'TRANSACTION_PROCESS',
      'adHocProcess': 'AD_HOC_PROCESS',
      
      // Data & Storage
      'database': 'DATABASE',
      'storage': 'STORAGE',
      'dataStore': 'DATA_STORE',
      'dataObject': 'DATA_OBJECT',
      'server': 'SERVER',
      'cloudStorage': 'CLOUD_STORAGE',
      'archive': 'ARCHIVE',
      'fileSystem': 'FILE_SYSTEM',
      
      // Integration & APIs
      'apiCall': 'API_CALL',
      'webService': 'WEB_SERVICE',
      'restApi': 'REST_API',
      'soapApi': 'SOAP_API',
      'webSocket': 'WEB_SOCKET',
      'integration': 'INTEGRATION',
      'webhook': 'WEBHOOK',
      'upload': 'UPLOAD',
      'download': 'DOWNLOAD',
      
      // Communication
      'message': 'MESSAGE',
      'chat': 'CHAT',
      'email': 'EMAIL',
      'phoneCall': 'PHONE_CALL',
      'videoCall': 'VIDEO_CALL',
      'voiceMessage': 'VOICE_MESSAGE',
      'notification': 'NOTIFICATION',
      'announcement': 'ANNOUNCEMENT',
      
      // Security
      'secureTask': 'SECURE_TASK',
      'unlock': 'UNLOCK',
      'authorization': 'AUTHORIZATION',
      'authentication': 'AUTHENTICATION',
      'verifyUser': 'VERIFY_USER',
      'blockUser': 'BLOCK_USER',
      
      // Business & Commerce
      'shoppingCart': 'SHOPPING_CART',
      'payment': 'PAYMENT',
      'transaction': 'TRANSACTION',
      'revenue': 'REVENUE',
      'analytics': 'ANALYTICS',
      'report': 'REPORT',
      'goal': 'GOAL',
      'achievement': 'ACHIEVEMENT',
      'product': 'PRODUCT',
      'delivery': 'DELIVERY',
      
      // Documents & Files
      'document': 'DOCUMENT',
      'createFile': 'CREATE_FILE',
      'deleteFile': 'DELETE_FILE',
      'verifyFile': 'VERIFY_FILE',
      'copy': 'COPY',
      'clipboard': 'CLIPBOARD',
      'bookmark': 'BOOKMARK',
      
      // UI & Display
      'desktopView': 'DESKTOP_VIEW',
      'mobileView': 'MOBILE_VIEW',
      'layout': 'LAYOUT',
      'textInput': 'TEXT_INPUT',
      'display': 'DISPLAY',
      'hide': 'HIDE',
      'image': 'IMAGE',
      'camera': 'CAMERA',
      
      // Location & Navigation
      'location': 'LOCATION',
      'map': 'MAP',
      'navigation': 'NAVIGATION',
      'direction': 'DIRECTION',
      'checkpoint': 'CHECKPOINT',
      
      // Operations
      'add': 'ADD',
      'subtract': 'SUBTRACT',
      'multiply': 'MULTIPLY',
      'calculate': 'CALCULATE',
      'percentage': 'PERCENTAGE',
      'search': 'SEARCH',
      'filter': 'FILTER',
      'delete': 'DELETE',
      'edit': 'EDIT',
      'refresh': 'REFRESH',
      
      // Status & Feedback
      'success': 'SUCCESS',
      'error': 'ERROR',
      'info': 'INFO',
      'warning': 'WARNING',
      'complete': 'COMPLETE',
      'failed': 'FAILED',
      'processing': 'PROCESSING',
      'pending': 'PENDING',
      
      // Custom
      'group': 'GROUP',
    }
    
    return typeMap[reactFlowType] || reactFlowType.toUpperCase()
  }

  /**
   * Map ReactFlow edge type to API PathType
   */
  private static mapEdgePathType(type?: string): string {
    const typeMap: Record<string, string> = {
      'default': 'smoothstep',
      'straight': 'STRAIGHT',
      'step': 'STEP',
      'smoothstep': 'smoothstep',
      'bezier': 'BEZIER',
    }
    return typeMap[type || 'default'] || 'smoothstep'
  }

  /**
   * Map API node type to ReactFlow node type
   */
  private static mapApiNodeTypeToReactFlow(apiType: string): string {
    const typeMap: Record<string, string> = {
      // Events
      'START_EVENT': 'startEvent',
      'END_EVENT': 'endEvent',
      'INTERMEDIATE_EVENT': 'intermediateEvent',
      'TIMER_EVENT': 'timerEvent',
      'MESSAGE_EVENT': 'messageEvent',
      'ERROR_EVENT': 'errorEvent',
      'SIGNAL_EVENT': 'signalEvent',
      'CANCEL_EVENT': 'cancelEvent',
      'ESCALATION_EVENT': 'escalationEvent',
      'NOTIFICATION_EVENT': 'notificationEvent',
      
      // Tasks
      'TASK': 'task',
      'USER_TASK': 'userTask',
      'SERVICE_TASK': 'serviceTask',
      'MANUAL_TASK': 'manualTask',
      'SCRIPT_TASK': 'scriptTask',
      'SEND_TASK': 'sendTask',
      'RECEIVE_TASK': 'receiveTask',
      'BUSINESS_RULE_TASK': 'businessTask',
      'CALL_ACTIVITY': 'processTask',
      'LOOP_TASK': 'loopTask',
      
      // Gateways
      'GATEWAY': 'gateway',
      'EXCLUSIVE_GATEWAY': 'exclusiveGateway',
      'PARALLEL_GATEWAY': 'parallelGateway',
      'INCLUSIVE_GATEWAY': 'inclusiveGateway',
      'EVENT_GATEWAY': 'eventBasedGateway',
      'COMPLEX_GATEWAY': 'complexGateway',
      'CONDITIONAL': 'conditional',
      
      // Processes
      'PROCESS': 'process',
      'SUBPROCESS': 'process',
      'LOOP_PROCESS': 'loopProcess',
      'MULTI_INSTANCE_PROCESS': 'multiInstanceProcess',
      'TRANSACTION_PROCESS': 'transactionProcess',
      'AD_HOC_PROCESS': 'adHocProcess',
      
      // Data & Storage
      'DATABASE': 'database',
      'STORAGE': 'storage',
      'DATA_STORE': 'dataStore',
      'DATA_OBJECT': 'dataObject',
      'SERVER': 'server',
      'CLOUD_STORAGE': 'cloudStorage',
      'ARCHIVE': 'archive',
      'FILE_SYSTEM': 'fileSystem',
      
      // Integration & APIs
      'API_CALL': 'apiCall',
      'WEB_SERVICE': 'webService',
      'REST_API': 'restApi',
      'SOAP_API': 'soapApi',
      'WEB_SOCKET': 'webSocket',
      'INTEGRATION': 'integration',
      'WEBHOOK': 'webhook',
      'UPLOAD': 'upload',
      'DOWNLOAD': 'download',
      
      // Communication
      'MESSAGE': 'message',
      'CHAT': 'chat',
      'EMAIL': 'email',
      'PHONE_CALL': 'phoneCall',
      'VIDEO_CALL': 'videoCall',
      'VOICE_MESSAGE': 'voiceMessage',
      'NOTIFICATION': 'notification',
      'ANNOUNCEMENT': 'announcement',
      
      // Security
      'SECURE_TASK': 'secureTask',
      'UNLOCK': 'unlock',
      'AUTHORIZATION': 'authorization',
      'AUTHENTICATION': 'authentication',
      'VERIFY_USER': 'verifyUser',
      'BLOCK_USER': 'blockUser',
      
      // Business & Commerce
      'SHOPPING_CART': 'shoppingCart',
      'PAYMENT': 'payment',
      'TRANSACTION': 'transaction',
      'REVENUE': 'revenue',
      'ANALYTICS': 'analytics',
      'REPORT': 'report',
      'GOAL': 'goal',
      'ACHIEVEMENT': 'achievement',
      'PRODUCT': 'product',
      'DELIVERY': 'delivery',
      
      // Documents & Files
      'DOCUMENT': 'document',
      'CREATE_FILE': 'createFile',
      'DELETE_FILE': 'deleteFile',
      'VERIFY_FILE': 'verifyFile',
      'COPY': 'copy',
      'CLIPBOARD': 'clipboard',
      'BOOKMARK': 'bookmark',
      
      // UI & Display
      'DESKTOP_VIEW': 'desktopView',
      'MOBILE_VIEW': 'mobileView',
      'LAYOUT': 'layout',
      'TEXT_INPUT': 'textInput',
      'DISPLAY': 'display',
      'HIDE': 'hide',
      'IMAGE': 'image',
      'CAMERA': 'camera',
      
      // Location & Navigation
      'LOCATION': 'location',
      'MAP': 'map',
      'NAVIGATION': 'navigation',
      'DIRECTION': 'direction',
      'CHECKPOINT': 'checkpoint',
      
      // Operations
      'ADD': 'add',
      'SUBTRACT': 'subtract',
      'MULTIPLY': 'multiply',
      'CALCULATE': 'calculate',
      'PERCENTAGE': 'percentage',
      'SEARCH': 'search',
      'FILTER': 'filter',
      'DELETE': 'delete',
      'EDIT': 'edit',
      'REFRESH': 'refresh',
      
      // Status & Feedback
      'SUCCESS': 'success',
      'ERROR': 'error',
      'INFO': 'info',
      'WARNING': 'warning',
      'COMPLETE': 'complete',
      'FAILED': 'failed',
      'PROCESSING': 'processing',
      'PENDING': 'pending',
      
      // Custom
      'GROUP': 'group',
      'CUSTOM_NODE': 'task',
    }
    
    return typeMap[apiType.toUpperCase()] || apiType.toLowerCase()
  }

  /**
   * Transform API node to ReactFlow node format
   */
  private static transformApiNodeToReactFlow(apiNode: any): Node {
    return {
      id: apiNode.id,
      type: this.mapApiNodeTypeToReactFlow(apiNode.type),
      position: { 
        x: apiNode.position?.x || apiNode.positionX || 0, 
        y: apiNode.position?.y || apiNode.positionY || 0 
      },
      data: {
        label: apiNode.label || apiNode.data?.label || 'Untitled',
        description: apiNode.description || apiNode.data?.description,
        ...(apiNode.data || {}),
      },
      ...(apiNode.width && { width: apiNode.width }),
      ...(apiNode.height && { height: apiNode.height }),
      ...(apiNode.style && { style: apiNode.style }),
      ...(apiNode.parentNode && { parentNode: apiNode.parentNode }),
      ...(apiNode.parentNodeId && { parentNode: apiNode.parentNodeId }),
      ...(apiNode.extent && { extent: apiNode.extent }),
      ...(apiNode.draggable !== undefined && { draggable: apiNode.draggable }),
      ...(apiNode.selectable !== undefined && { selectable: apiNode.selectable }),
      ...(apiNode.connectable !== undefined && { connectable: apiNode.connectable }),
    }
  }

  /**
   * Transform API edge to ReactFlow edge format
   */
  private static transformApiEdgeToReactFlow(apiEdge: any): Edge {
    return {
      id: apiEdge.id,
      source: apiEdge.source || apiEdge.fromId,
      target: apiEdge.target || apiEdge.toId,
      type: apiEdge.type?.toLowerCase() || apiEdge.pathType?.toLowerCase() || 'smoothstep',
      ...(apiEdge.label && { label: apiEdge.label }),
      ...(apiEdge.animated !== undefined && { animated: apiEdge.animated }),
      ...(apiEdge.sourceHandle && { sourceHandle: apiEdge.sourceHandle }),
      ...(apiEdge.targetHandle && { targetHandle: apiEdge.targetHandle }),
      ...(apiEdge.style && { style: apiEdge.style }),
      ...(apiEdge.data && { data: apiEdge.data }),
      ...(apiEdge.metadata && { data: apiEdge.metadata }),
    }
  }

  /**
   * Load flow diagram for a process
   */
  static async loadFlow(processId: string, version?: number): Promise<LoadFlowResponse> {
    const url = version 
      ? `/processes/${processId}/flow?version=${version}`
      : `/processes/${processId}/flow`
    const response = await apiClient.get(url)
    
    // Transform API response to ReactFlow format
    const apiData = response.data
    
    return {
      processId: apiData.processId,
      versionId: apiData.versionId,
      version: apiData.version,
      status: apiData.status,
      nodes: (apiData.nodes || []).map((node: any) => this.transformApiNodeToReactFlow(node)),
      edges: (apiData.edges || []).map((edge: any) => this.transformApiEdgeToReactFlow(edge)),
    }
  }

  /**
   * Auto-save flow diagram (debounced save)
   */
  static async autoSaveFlow(
    processId: string, 
    nodes: Node[], 
    edges: Edge[]
  ): Promise<SaveFlowResponse> {
    // Auto-save with specific log message
    return this.saveFlow(processId, nodes, edges, 'Auto-save')
  }

  /**
   * Create a new process with initial flow
   */
  static async createProcessWithFlow(
    processData: {
      name: string
      description?: string
      level: number
      parentId?: string
    },
    nodes: Node[],
    edges: Edge[]
  ): Promise<{
    process: any
    processVersion: any
    flow: SaveFlowResponse
  }> {
    const response = await apiClient.post('/processes/create-with-flow', {
      processData,
      nodes,
      edges
    })
    return response.data
  }

  /**
   * Export flow to different formats
   */
  static async exportFlow(
    processId: string,
    format: 'json' | 'png' | 'svg' | 'pdf' = 'json'
  ): Promise<Blob | object> {
    const response = await apiClient.get(
      `/processes/${processId}/flow/export`,
      {
        params: { format },
        responseType: format === 'json' ? 'json' : 'blob'
      }
    )
    return response.data
  }

  /**
   * Get flow history/versions
   */
  static async getFlowHistory(processId: string): Promise<{
    versions: Array<{
      id: string
      createdAt: string
      nodeCount: number
      edgeCount: number
      author?: string
    }>
  }> {
    const response = await apiClient.get(`/processes/${processId}/flow/history`)
    return response.data
  }

  /**
   * Validate flow diagram
   */
  static async validateFlow(nodes: Node[], edges: Edge[]): Promise<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }> {
    const response = await apiClient.post('/processes/flow/validate', {
      nodes,
      edges
    })
    return response.data
  }
}