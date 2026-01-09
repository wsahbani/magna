/**
 * Process AI Service
 * Service métier pour la génération IA de Process (niveau 2)
 */

import { Injectable, Logger } from '@nestjs/common';
import { AIClientService } from './ai-client.service';
import { AICacheService } from './ai-cache.service';
import { buildGenerateProcessPrompt } from '../prompts/generate-process.prompt';
import type { ProcessContext, GeneratedProcessStructure } from '../interfaces/process.interface';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessService } from '../../process/services/process.service';
import { ProcessFlowService } from '../../process/services/process-flow.service';
import { ProcessStatus, ProcessType } from '@prisma/client';
import { SaveNodeDto, SaveEdgeDto } from '../../process/dto/save-flow.dto';

@Injectable()
export class ProcessAIService {
  private readonly logger = new Logger(ProcessAIService.name);

  constructor(
    private readonly aiClient: AIClientService,
    private readonly cache: AICacheService,
    private readonly prisma: PrismaService,
    private readonly processService: ProcessService,
    private readonly processFlowService: ProcessFlowService,
  ) {}

  /**
   * Génère un processus à partir d'une description textuelle
   */
  async generateFromDescription(
    description: string,
    context: ProcessContext,
  ): Promise<{
    structure: GeneratedProcessStructure;
    tokensUsed: { prompt: number; completion: number; total: number };
    cost: number;
    cached: boolean;
  }> {
    // Récupérer les informations du ProcessMap, workspace et département
    const processMap = await this.prisma.processMap.findUnique({
      where: { id: context.processMapId },
      select: { title: true },
    });

    const workspace = await this.prisma.workspace.findUnique({
      where: { id: context.workspaceId },
      select: { name: true },
    });

    const department = context.departmentId
      ? await this.prisma.department.findUnique({
          where: { id: context.departmentId },
          select: { name: true },
        })
      : null;

    // Construire le prompt
    const { system, user } = buildGenerateProcessPrompt(description, {
      processMapName: processMap?.title,
      workspaceName: workspace?.name,
      departmentName: department?.name,
      flowDirection: context.flowDirection || 'horizontal',
    });

    // Créer une clé de cache basée sur la description et le contexte
    const cacheKey = `${system}\n\n${user}`;

    // Vérifier le cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.log('Using cached response');
      const structure = this.parseAIResponse(cached.content);
      const cost = this.aiClient.calculateCost(cached.tokensUsed);
      return {
        structure,
        tokensUsed: cached.tokensUsed,
        cost,
        cached: true,
      };
    }

    // Appeler l'IA
    this.logger.log('Calling OpenAI API');
    const fullPrompt = `${system}\n\n${user}`;
    const response = await this.aiClient.generate(fullPrompt, {
      maxTokens: 9000,
      temperature: 0.7,
    });

    // Mettre en cache
    this.cache.set(cacheKey, response.content, response.tokensUsed, response.model);

    // Parser la réponse
    const structure = this.parseAIResponse(response.content);
    const cost = this.aiClient.calculateCost(response.tokensUsed);

    return {
      structure,
      tokensUsed: response.tokensUsed,
      cost,
      cached: false,
    };
  }

  /**
   * Crée un Process complet à partir d'une structure générée par IA
   * Inclut le Process, le FlowDiagram, et tous les nodes (procédures, tâches, événements, gateways)
   */
  async createProcessFromAI(
    structure: GeneratedProcessStructure,
    processMapId: string,
    workspaceId: string | undefined,
    departmentId: string | undefined,
    code: string | undefined,
    userId: string,
    flowDirection: 'horizontal' | 'vertical' = 'horizontal',
  ) {
    // Récupérer le ProcessMap pour obtenir workspaceId et departmentId si non fournis
    const processMap = await this.prisma.processMap.findUnique({
      where: { id: processMapId },
      select: { workspaceId: true, departmentId: true },
    });

    if (!processMap) {
      throw new Error(`ProcessMap with ID "${processMapId}" not found`);
    }

    const finalWorkspaceId = workspaceId || processMap.workspaceId;
    const finalDepartmentId = departmentId || processMap.departmentId || undefined;

    // Valider que workspaceId est défini (obligatoire)
    if (!finalWorkspaceId) {
      throw new Error(
        `Workspace ID is required. ProcessMap "${processMapId}" does not have a workspaceId and none was provided.`,
      );
    }

    // Générer un code si non fourni
    const processCode =
      code ||
      `PROC-${structure.title
        .substring(0, 10)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

    // Créer le Process
    const process = await this.processService.create(
      {
        title: structure.title,
        code: processCode,
        description: structure.description,
        processMapId,
        workspaceId: finalWorkspaceId,
        departmentId: finalDepartmentId,
        status: ProcessStatus.DRAFT,
        type: ProcessType.FLOW, // Toujours FLOW pour les processus générés par IA
      },
      userId,
    );

    // Vérifier que le Process a été créé avec succès
    if (!process || !process.id) {
      throw new Error('Failed to create Process. Process creation returned null or undefined.');
    }

    // Transformer la structure IA en nodes ReactFlow
    const nodes: SaveNodeDto[] = [];
    const edges: SaveEdgeDto[] = [];

    // Mapping des IDs temporaires de l'IA vers les IDs réels générés
    const idMapping: Map<string, string> = new Map();

    // Valeurs par défaut
    const DEFAULT_PROCEDURE_WIDTH = 160;
    const DEFAULT_PROCEDURE_HEIGHT = 70;
    const DEFAULT_TASK_WIDTH = 140;
    const DEFAULT_TASK_HEIGHT = 60;
    const DEFAULT_EVENT_SIZE = 45;
    const DEFAULT_GATEWAY_SIZE = 55;
    const START_X = 100;
    const START_Y = 200;
    let currentX = START_X;

    const uniquePrefix = `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Filtrer les événements par type
    const startEvents = structure.events?.filter((e) => e.type === 'startEvent') || [];
    const endEvents = structure.events?.filter((e) => e.type === 'endEvent') || [];
    const intermediateEvents = structure.events?.filter((e) => e.type === 'intermediateEvent') || [];
    const timerEvents = structure.events?.filter((e) => e.type === 'timerEvent') || [];
    const messageEvents = structure.events?.filter((e) => e.type === 'messageEvent') || [];

    // Start event
    const startEventId = `${uniquePrefix}-startEvent`;
    if (startEvents.length > 0) {
      const startEvent = startEvents[0];
      const x = startEvent.position?.x ?? currentX;
      const y = startEvent.position?.y ?? START_Y;
      const size = startEvent.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (startEvent.id) {
        idMapping.set(startEvent.id, startEventId);
      }
      nodes.push({
        id: startEventId,
        type: 'startEvent',
        label: startEvent.label,
        description: startEvent.description,
        positionX: x,
        positionY: y,
        width: size,
        height: size,
        data: {
          description: startEvent.description,
        },
      });
      currentX = x + size + this.getMinSpacing({ type: 'startEvent', width: size, height: size } as SaveNodeDto) - size;
    } else {
      // Si pas d'ID temporaire, utiliser un ID par défaut
      idMapping.set('start-1', startEventId);
      nodes.push({
        id: startEventId,
        type: 'startEvent',
        label: 'Début',
        positionX: currentX,
        positionY: START_Y,
        width: DEFAULT_EVENT_SIZE,
        height: DEFAULT_EVENT_SIZE,
        data: {},
      });
      currentX += DEFAULT_EVENT_SIZE + (this.getMinSpacing({ type: 'startEvent', width: DEFAULT_EVENT_SIZE, height: DEFAULT_EVENT_SIZE } as SaveNodeDto) - DEFAULT_EVENT_SIZE);
    }

    // Créer les procédures
    structure.procedures?.forEach((procedure, index) => {
      const x = procedure.position?.x ?? currentX;
      const y = procedure.position?.y ?? START_Y;
      const width = procedure.dimensions?.width ?? DEFAULT_PROCEDURE_WIDTH;
      const height = procedure.dimensions?.height ?? DEFAULT_PROCEDURE_HEIGHT;
      const procedureId = `${uniquePrefix}-procedure-${index}`;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (procedure.id) {
        idMapping.set(procedure.id, procedureId);
      } else {
        // Si pas d'ID temporaire, créer un mapping par défaut
        idMapping.set(`proc-${index + 1}`, procedureId);
      }
      nodes.push({
        id: procedureId,
        type: 'procedure',
        label: procedure.label,
        description: procedure.description,
        positionX: x,
        positionY: y,
        width,
        height,
        data: {
          description: procedure.description,
        },
      });
      currentX = Math.max(currentX, x + width + (this.getMinSpacing({ type: 'procedure', width, height } as SaveNodeDto) - width));
    });

    // Créer les tâches (utiliser le type spécifié ou 'task' par défaut)
    structure.tasks?.forEach((task, index) => {
      const x = task.position?.x ?? currentX;
      const y = task.position?.y ?? START_Y;
      const width = task.dimensions?.width ?? DEFAULT_TASK_WIDTH;
      const height = task.dimensions?.height ?? DEFAULT_TASK_HEIGHT;
      const taskType = task.type || 'task'; // Utiliser le type spécifié ou 'task' par défaut
      const taskId = `${uniquePrefix}-${taskType}-${index}`;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (task.id) {
        idMapping.set(task.id, taskId);
      } else {
        // Si pas d'ID temporaire, créer un mapping par défaut
        idMapping.set(`task-${index + 1}`, taskId);
      }
      nodes.push({
        id: taskId,
        type: taskType,
        label: task.label,
        description: task.description,
        positionX: x,
        positionY: y,
        width,
        height,
        data: {
          description: task.description,
        },
      });
      const taskSpacing = this.getMinSpacing({ type: taskType, width, height } as SaveNodeDto) - width;
      currentX = Math.max(currentX, x + width + taskSpacing);
    });

    // Créer les gateways
    structure.gateways?.forEach((gateway, index) => {
      const x = gateway.position?.x ?? currentX;
      const y = gateway.position?.y ?? START_Y;
      const size = gateway.dimensions?.width ?? DEFAULT_GATEWAY_SIZE;
      const gatewayId = `${uniquePrefix}-gateway-${index}`;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (gateway.id) {
        idMapping.set(gateway.id, gatewayId);
      } else {
        // Si pas d'ID temporaire, créer un mapping par défaut
        idMapping.set(`gateway-${index + 1}`, gatewayId);
      }
      nodes.push({
        id: gatewayId,
        type: gateway.type,
        label: gateway.label,
        description: gateway.description,
        positionX: x,
        positionY: y,
        width: size,
        height: size,
        data: {
          description: gateway.description,
        },
      });
      const gatewaySpacing = this.getMinSpacing({ type: gateway.type, width: size, height: size } as SaveNodeDto) - size;
      currentX = Math.max(currentX, x + size + gatewaySpacing);
    });

    // Créer les événements intermédiaires
    intermediateEvents.forEach((event, index) => {
      const x = event.position?.x ?? currentX;
      const y = event.position?.y ?? START_Y;
      const size = event.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      const eventId = `${uniquePrefix}-intermediateEvent-${index}`;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (event.id) {
        idMapping.set(event.id, eventId);
      } else {
        idMapping.set(`event-${index + 1}`, eventId);
      }
      nodes.push({
        id: eventId,
        type: 'intermediateEvent',
        label: event.label,
        description: event.description,
        positionX: x,
        positionY: y,
        width: size,
        height: size,
        data: {
          description: event.description,
        },
      });
      const eventSpacing = this.getMinSpacing({ type: 'intermediateEvent', width: size, height: size } as SaveNodeDto) - size;
      currentX = Math.max(currentX, x + size + eventSpacing);
    });

    // Créer les événements timer
    timerEvents.forEach((event, index) => {
      const x = event.position?.x ?? currentX;
      const y = event.position?.y ?? START_Y;
      const size = event.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      const eventId = `${uniquePrefix}-timerEvent-${index}`;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (event.id) {
        idMapping.set(event.id, eventId);
      } else {
        idMapping.set(`timer-${index + 1}`, eventId);
      }
      nodes.push({
        id: eventId,
        type: 'timerEvent',
        label: event.label,
        description: event.description,
        positionX: x,
        positionY: y,
        width: size,
        height: size,
        data: {
          description: event.description,
        },
      });
      const timerEventSpacing = this.getMinSpacing({ type: 'timerEvent', width: size, height: size } as SaveNodeDto) - size;
      currentX = Math.max(currentX, x + size + timerEventSpacing);
    });

    // Créer les événements message
    messageEvents.forEach((event, index) => {
      const x = event.position?.x ?? currentX;
      const y = event.position?.y ?? START_Y;
      const size = event.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      const eventId = `${uniquePrefix}-messageEvent-${index}`;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (event.id) {
        idMapping.set(event.id, eventId);
      } else {
        idMapping.set(`message-${index + 1}`, eventId);
      }
      nodes.push({
        id: eventId,
        type: 'messageEvent',
        label: event.label,
        description: event.description,
        positionX: x,
        positionY: y,
        width: size,
        height: size,
        data: {
          description: event.description,
        },
      });
      const messageEventSpacing = this.getMinSpacing({ type: 'messageEvent', width: size, height: size } as SaveNodeDto) - size;
      currentX = Math.max(currentX, x + size + messageEventSpacing);
    });

    // End event
    const endEventId = `${uniquePrefix}-endEvent`;
    if (endEvents.length > 0) {
      const endEvent = endEvents[0];
      const x = endEvent.position?.x ?? currentX;
      const y = endEvent.position?.y ?? START_Y;
      const size = endEvent.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      // Mapper l'ID temporaire de l'IA vers l'ID réel
      if (endEvent.id) {
        idMapping.set(endEvent.id, endEventId);
      }
      nodes.push({
        id: endEventId,
        type: 'endEvent',
        label: endEvent.label,
        description: endEvent.description,
        positionX: x,
        positionY: y,
        width: size,
        height: size,
        data: {
          description: endEvent.description,
        },
      });
    } else {
      // Si pas d'ID temporaire, utiliser un ID par défaut
      idMapping.set('end-1', endEventId);
      nodes.push({
        id: endEventId,
        type: 'endEvent',
        label: 'Fin',
        positionX: currentX,
        positionY: START_Y,
        width: DEFAULT_EVENT_SIZE,
        height: DEFAULT_EVENT_SIZE,
        data: {},
      });
    }

    // Repositionner les nœuds pour éviter les chevauchements
    const repositionedNodes = this.repositionNodes(nodes, flowDirection);
    this.logger.log(
      `Repositionnement effectué: ${nodes.length} nœuds repositionnés selon flowDirection=${flowDirection}`,
    );

    // Créer les edges en mappant les IDs temporaires vers les IDs réels
    if (structure.edges && structure.edges.length > 0) {
      structure.edges.forEach((edge) => {
        const sourceId = idMapping.get(edge.source);
        const targetId = idMapping.get(edge.target);

        if (!sourceId || !targetId) {
          this.logger.warn(
            `Edge ignoré: source "${edge.source}" ou target "${edge.target}" non trouvé dans le mapping`,
          );
          return;
        }

        edges.push({
          id: `${uniquePrefix}-edge-${edges.length}`,
          source: sourceId,
          target: targetId,
          label: edge.label,
          type: this.normalizeEdgeType(edge.type),
          data: edge.label ? { condition: edge.label } : undefined,
        });
      });
    }

    // Repositionner les branches des gateways en parallèle pour une meilleure présentation
    const gatewayBranches = this.analyzeGatewayBranches(repositionedNodes, edges);
    if (gatewayBranches.size > 0) {
      this.logger.log(
        `Repositionnement parallèle: ${gatewayBranches.size} gateways avec branches multiples détectés`,
      );
      
      gatewayBranches.forEach((branches, gatewayId) => {
        const gateway = repositionedNodes.find((n) => n.id === gatewayId);
        if (gateway) {
          const parallelPositions = this.calculateParallelPositions(
            gateway,
            branches,
            repositionedNodes,
            flowDirection,
          );
          
          // Appliquer les nouvelles positions aux nœuds des branches
          parallelPositions.forEach((newPosition, nodeId) => {
            const nodeIndex = repositionedNodes.findIndex((n) => n.id === nodeId);
            if (nodeIndex !== -1) {
              repositionedNodes[nodeIndex].positionX = newPosition.positionX;
              repositionedNodes[nodeIndex].positionY = newPosition.positionY;
            }
          });
        }
      });
    }

    // Sauvegarder le flow avec tous les nodes repositionnés
    await this.processFlowService.saveFlow(
      {
        processId: process.id,
        nodes: repositionedNodes,
        edges,
      },
      userId,
    );

    return process;
  }

  /**
   * Analyse les edges pour identifier les gateways et leurs branches sortantes
   * Retourne une map des gateways vers leurs nœuds cibles
   */
  private analyzeGatewayBranches(
    nodes: SaveNodeDto[],
    edges: Array<{ source: string; target: string; label?: string }>,
  ): Map<string, Array<{ nodeId: string; edgeLabel?: string }>> {
    const gatewayBranches = new Map<string, Array<{ nodeId: string; edgeLabel?: string }>>();

    // Identifier les gateways (nœuds avec type contenant "Gateway")
    const gatewayNodes = nodes.filter((node) =>
      node.type?.toLowerCase().includes('gateway'),
    );

    // Pour chaque gateway, trouver toutes les edges sortantes
    gatewayNodes.forEach((gateway) => {
      const outgoingEdges = edges.filter((edge) => edge.source === gateway.id);
      
      // Si le gateway a plusieurs branches sortantes (au moins 2), l'ajouter à la map
      if (outgoingEdges.length >= 2) {
        const branches = outgoingEdges.map((edge) => ({
          nodeId: edge.target,
          edgeLabel: edge.label,
        }));
        gatewayBranches.set(gateway.id, branches);
      }
    });

    return gatewayBranches;
  }

  /**
   * Calcule les positions parallèles pour les branches d'un gateway
   * Retourne une map des IDs de nœuds vers leurs nouvelles positions
   */
  private calculateParallelPositions(
    gateway: SaveNodeDto,
    branches: Array<{ nodeId: string; edgeLabel?: string }>,
    nodes: SaveNodeDto[],
    flowDirection: 'horizontal' | 'vertical',
  ): Map<string, { positionX: number; positionY: number }> {
    const positions = new Map<string, { positionX: number; positionY: number }>();
    
    if (branches.length === 0) {
      return positions;
    }

    const gatewayX = gateway.positionX;
    const gatewayY = gateway.positionY;
    const gatewayWidth = gateway.width || 55;
    const gatewayHeight = gateway.height || 55;

    // Espacement entre le gateway et les branches
    const spacingAfterGateway = 100;
    
    // Espacement entre les branches parallèles
    const branchSpacing = 180;

    if (flowDirection === 'horizontal') {
      // Flow horizontal : branches en parallèle verticalement
      const startX = gatewayX + gatewayWidth + spacingAfterGateway;
      
      // Calculer le Y de départ pour centrer les branches autour du gateway
      const totalHeight = (branches.length - 1) * branchSpacing;
      const startY = gatewayY - totalHeight / 2;

      branches.forEach((branch, index) => {
        const branchNode = nodes.find((n) => n.id === branch.nodeId);
        if (branchNode) {
          const branchHeight = branchNode.height || 60;
          const branchY = startY + index * branchSpacing;
          
          // Centrer verticalement la branche
          const centeredY = branchY - branchHeight / 2 + gatewayHeight / 2;
          
          positions.set(branch.nodeId, {
            positionX: startX,
            positionY: centeredY,
          });
        }
      });
    } else {
      // Flow vertical : branches en parallèle horizontalement
      const startY = gatewayY + gatewayHeight + spacingAfterGateway;
      
      // Calculer le X de départ pour centrer les branches autour du gateway
      const totalWidth = (branches.length - 1) * branchSpacing;
      const startX = gatewayX - totalWidth / 2;

      branches.forEach((branch, index) => {
        const branchNode = nodes.find((n) => n.id === branch.nodeId);
        if (branchNode) {
          const branchWidth = branchNode.width || 140;
          const branchX = startX + index * branchSpacing;
          
          // Centrer horizontalement la branche
          const centeredX = branchX - branchWidth / 2 + gatewayWidth / 2;
          
          positions.set(branch.nodeId, {
            positionX: centeredX,
            positionY: startY,
          });
        }
      });
    }

    return positions;
  }

  /**
   * Normalise le type d'edge pour s'assurer qu'il est compatible avec ReactFlow
   * Convertit les variantes comme "smooth_step" en "smoothstep"
   */
  private normalizeEdgeType(type?: string): string {
    if (!type) return 'smoothstep';
    
    const normalized = type.toLowerCase().replace(/[_-]/g, '');
    
    // Types valides pour ReactFlow
    const validTypes = ['smoothstep', 'straight', 'step', 'bezier'];
    
    if (validTypes.includes(normalized)) {
      return normalized;
    }
    
    // Par défaut, utiliser smoothstep
    return 'smoothstep';
  }

  /**
   * Parse la réponse JSON de l'IA et valide la structure
   */
  /**
   * Détecte si deux nœuds se chevauchent
   */
  private detectOverlap(node1: SaveNodeDto, node2: SaveNodeDto): boolean {
    const width1 = node1.width || 0;
    const height1 = node1.height || 0;
    const width2 = node2.width || 0;
    const height2 = node2.height || 0;

    return !(
      node1.positionX + width1 < node2.positionX ||
      node2.positionX + width2 < node1.positionX ||
      node1.positionY + height1 < node2.positionY ||
      node2.positionY + height2 < node1.positionY
    );
  }

  /**
   * Calcule l'espacement minimal requis selon le type de nœud
   */
  private getMinSpacing(node: SaveNodeDto): number {
    const nodeType = node.type;
    const width = node.width || 0;
    const height = node.height || 0;

    // Espacement basé sur le type de nœud
    if (nodeType === 'procedure') {
      return width + 100; // Procédures: largeur + 100px
    } else if (['task', 'userTask', 'serviceTask', 'manualTask', 'scriptTask'].includes(nodeType)) {
      return width + 80; // Tâches: largeur + 80px
    } else if (['startEvent', 'endEvent', 'intermediateEvent', 'timerEvent', 'messageEvent'].includes(nodeType)) {
      return Math.max(width, height) + 60; // Événements: taille + 60px
    } else if (
      ['exclusiveGateway', 'parallelGateway', 'inclusiveGateway', 'eventBasedGateway'].includes(nodeType)
    ) {
      return Math.max(width, height) + 70; // Gateways: taille + 70px
    }

    // Par défaut: largeur + 80px
    return Math.max(width, height) + 80;
  }

  /**
   * Repositionne les nœuds pour éviter les chevauchements selon la direction du flow
   */
  private repositionNodes(nodes: SaveNodeDto[], flowDirection: 'horizontal' | 'vertical'): SaveNodeDto[] {
    if (nodes.length === 0) {
      return nodes;
    }

    const isHorizontal = flowDirection === 'horizontal';
    const sortedNodes = [...nodes].sort((a, b) => {
      if (isHorizontal) {
        return a.positionX - b.positionX;
      } else {
        return a.positionY - b.positionY;
      }
    });

    const repositionedNodes: SaveNodeDto[] = [];

    for (let i = 0; i < sortedNodes.length; i++) {
      const currentNode = { ...sortedNodes[i] };

      if (i === 0) {
        // Premier nœud: garder sa position
        repositionedNodes.push(currentNode);
        continue;
      }

      const previousNode = repositionedNodes[repositionedNodes.length - 1];
      const minSpacing = this.getMinSpacing(previousNode);

      const prevWidth = previousNode.width || 0;
      const prevHeight = previousNode.height || 0;
      const currWidth = currentNode.width || 0;
      const currHeight = currentNode.height || 0;

      if (isHorizontal) {
        // Flow horizontal: ajuster la position X
        const requiredX = previousNode.positionX + prevWidth + minSpacing;
        if (currentNode.positionX < requiredX) {
          currentNode.positionX = requiredX;
        }
        // Garder Y constant ou légèrement variable (±10px)
        if (Math.abs(currentNode.positionY - previousNode.positionY) > 10) {
          currentNode.positionY = previousNode.positionY;
        }
      } else {
        // Flow vertical: ajuster la position Y
        const requiredY = previousNode.positionY + prevHeight + minSpacing;
        if (currentNode.positionY < requiredY) {
          currentNode.positionY = requiredY;
        }
        // Garder X constant ou légèrement variable (±10px)
        if (Math.abs(currentNode.positionX - previousNode.positionX) > 10) {
          currentNode.positionX = previousNode.positionX;
        }
      }

      // Vérifier qu'il n'y a toujours pas de chevauchement avec les nœuds précédents
      let hasOverlap = true;
      let attempts = 0;
      const maxAttempts = 10;

      while (hasOverlap && attempts < maxAttempts) {
        hasOverlap = false;
        for (let j = 0; j < repositionedNodes.length; j++) {
          if (this.detectOverlap(repositionedNodes[j], currentNode)) {
            hasOverlap = true;
            const nodeWidth = repositionedNodes[j].width || 0;
            const nodeHeight = repositionedNodes[j].height || 0;
            if (isHorizontal) {
              currentNode.positionX = repositionedNodes[j].positionX + nodeWidth + minSpacing;
            } else {
              currentNode.positionY = repositionedNodes[j].positionY + nodeHeight + minSpacing;
            }
            break;
          }
        }
        attempts++;
      }

      repositionedNodes.push(currentNode);
    }

    return repositionedNodes;
  }

  private parseAIResponse(content: string): GeneratedProcessStructure {
    try {
      // Nettoyer le contenu (enlever markdown code blocks si présents)
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(cleanedContent);

      // Validation basique
      if (!parsed.title || !parsed.description) {
        throw new Error('Invalid structure: missing title or description');
      }

      // Valider que au moins un élément est présent
      const hasProcedures = parsed.procedures && Array.isArray(parsed.procedures) && parsed.procedures.length > 0;
      const hasTasks = parsed.tasks && Array.isArray(parsed.tasks) && parsed.tasks.length > 0;
      const hasEvents = parsed.events && Array.isArray(parsed.events) && parsed.events.length > 0;

      if (!hasProcedures && !hasTasks && !hasEvents) {
        throw new Error('Invalid structure: must have at least procedures, tasks, or events');
      }

      // Valider les procédures
      if (parsed.procedures) {
        for (const procedure of parsed.procedures) {
          if (!procedure.label) {
            throw new Error('Procedure missing label');
          }
        }
      }

      // Valider les tâches
      if (parsed.tasks) {
        const validTaskTypes = ['task', 'userTask', 'serviceTask', 'manualTask', 'scriptTask'];
        for (const task of parsed.tasks) {
          if (!task.label) {
            throw new Error('Task missing label');
          }
          // Valider le type si présent, sinon accepter (sera 'task' par défaut dans le service)
          if (task.type && !validTaskTypes.includes(task.type)) {
            throw new Error(`Invalid task type: ${task.type}. Valid types are: ${validTaskTypes.join(', ')}`);
          }
        }
      }

      // Valider les événements
      if (parsed.events) {
        const validEventTypes = ['startEvent', 'endEvent', 'intermediateEvent', 'timerEvent', 'messageEvent'];
        for (const event of parsed.events) {
          if (!event.type || !validEventTypes.includes(event.type)) {
            throw new Error(`Invalid event type: ${event.type}. Valid types are: ${validEventTypes.join(', ')}`);
          }
          if (!event.label) {
            throw new Error('Event missing label');
          }
        }
      }

      // Valider les gateways
      if (parsed.gateways) {
        const validGatewayTypes = ['exclusiveGateway', 'parallelGateway', 'inclusiveGateway', 'eventBasedGateway'];
        for (const gateway of parsed.gateways) {
          if (!gateway.type || !validGatewayTypes.includes(gateway.type)) {
            throw new Error(`Invalid gateway type: ${gateway.type}. Valid types are: ${validGatewayTypes.join(', ')}`);
          }
        }
      }

      // Valider les edges
      if (parsed.edges) {
        // Collecter tous les IDs de nœuds disponibles
        const nodeIds = new Set<string>();
        
        // IDs des procédures
        if (parsed.procedures) {
          parsed.procedures.forEach((proc) => {
            if (proc.id) nodeIds.add(proc.id);
          });
        }
        
        // IDs des tâches
        if (parsed.tasks) {
          parsed.tasks.forEach((task) => {
            if (task.id) nodeIds.add(task.id);
          });
        }
        
        // IDs des événements
        if (parsed.events) {
          parsed.events.forEach((event) => {
            if (event.id) nodeIds.add(event.id);
          });
        }
        
        // IDs des gateways
        if (parsed.gateways) {
          parsed.gateways.forEach((gateway) => {
            if (gateway.id) nodeIds.add(gateway.id);
          });
        }

        // Valider chaque edge
        for (const edge of parsed.edges) {
          if (!edge.source || !edge.target) {
            throw new Error('Edge missing source or target');
          }
          
          // Vérifier que source et target existent dans les nœuds
          if (!nodeIds.has(edge.source)) {
            throw new Error(`Edge source "${edge.source}" does not reference any node`);
          }
          if (!nodeIds.has(edge.target)) {
            throw new Error(`Edge target "${edge.target}" does not reference any node`);
          }
        }
      }

      return parsed as GeneratedProcessStructure;
    } catch (error: any) {
      this.logger.error(`Failed to parse AI response: ${error.message}`);
      this.logger.debug(`Response content: ${content.substring(0, 500)}`);
      throw new Error(`Invalid AI response format: ${error.message}`);
    }
  }
}
