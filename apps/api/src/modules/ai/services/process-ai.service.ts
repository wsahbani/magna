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
import { SaveNodeDto } from '../../process/dto/save-flow.dto';

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
      maxTokens: 3000,
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

    // Transformer la structure IA en nodes ReactFlow
    const nodes: SaveNodeDto[] = [];
    const edges: any[] = [];

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

    // Créer les événements de début et fin
    const startEvents = structure.events?.filter((e) => e.type === 'startEvent') || [];
    const endEvents = structure.events?.filter((e) => e.type === 'endEvent') || [];
    const intermediateEvents = structure.events?.filter((e) => e.type === 'intermediateEvent') || [];

    // Start event
    if (startEvents.length > 0) {
      const startEvent = startEvents[0];
      const x = startEvent.position?.x ?? currentX;
      const y = startEvent.position?.y ?? START_Y;
      const size = startEvent.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      nodes.push({
        id: `${uniquePrefix}-startEvent`,
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
      currentX = x + size + 50;
    } else {
      nodes.push({
        id: `${uniquePrefix}-startEvent`,
        type: 'startEvent',
        label: 'Début',
        positionX: currentX,
        positionY: START_Y,
        width: DEFAULT_EVENT_SIZE,
        height: DEFAULT_EVENT_SIZE,
        data: {},
      });
      currentX += DEFAULT_EVENT_SIZE + 50;
    }

    // Créer les procédures
    structure.procedures?.forEach((procedure, index) => {
      const x = procedure.position?.x ?? currentX;
      const y = procedure.position?.y ?? START_Y;
      const width = procedure.dimensions?.width ?? DEFAULT_PROCEDURE_WIDTH;
      const height = procedure.dimensions?.height ?? DEFAULT_PROCEDURE_HEIGHT;
      nodes.push({
        id: `${uniquePrefix}-procedure-${index}`,
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
      currentX = Math.max(currentX, x + width + 50);
    });

    // Créer les tâches
    structure.tasks?.forEach((task, index) => {
      const x = task.position?.x ?? currentX;
      const y = task.position?.y ?? START_Y;
      const width = task.dimensions?.width ?? DEFAULT_TASK_WIDTH;
      const height = task.dimensions?.height ?? DEFAULT_TASK_HEIGHT;
      nodes.push({
        id: `${uniquePrefix}-task-${index}`,
        type: 'task',
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
      currentX = Math.max(currentX, x + width + 50);
    });

    // Créer les gateways
    structure.gateways?.forEach((gateway, index) => {
      const x = gateway.position?.x ?? currentX;
      const y = gateway.position?.y ?? START_Y;
      const size = gateway.dimensions?.width ?? DEFAULT_GATEWAY_SIZE;
      nodes.push({
        id: `${uniquePrefix}-gateway-${index}`,
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
      currentX = Math.max(currentX, x + size + 50);
    });

    // Créer les événements intermédiaires
    intermediateEvents.forEach((event, index) => {
      const x = event.position?.x ?? currentX;
      const y = event.position?.y ?? START_Y;
      const size = event.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      nodes.push({
        id: `${uniquePrefix}-intermediateEvent-${index}`,
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
      currentX = Math.max(currentX, x + size + 50);
    });

    // End event
    if (endEvents.length > 0) {
      const endEvent = endEvents[0];
      const x = endEvent.position?.x ?? currentX;
      const y = endEvent.position?.y ?? START_Y;
      const size = endEvent.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      nodes.push({
        id: `${uniquePrefix}-endEvent`,
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
      nodes.push({
        id: `${uniquePrefix}-endEvent`,
        type: 'endEvent',
        label: 'Fin',
        positionX: currentX,
        positionY: START_Y,
        width: DEFAULT_EVENT_SIZE,
        height: DEFAULT_EVENT_SIZE,
        data: {},
      });
    }

    // Sauvegarder le flow avec tous les nodes
    await this.processFlowService.saveFlow(
      {
        processId: process.id,
        nodes,
        edges,
      },
      userId,
    );

    return process;
  }

  /**
   * Parse la réponse JSON de l'IA et valide la structure
   */
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
        for (const task of parsed.tasks) {
          if (!task.label) {
            throw new Error('Task missing label');
          }
        }
      }

      // Valider les événements
      if (parsed.events) {
        for (const event of parsed.events) {
          if (
            !event.type ||
            !['startEvent', 'endEvent', 'intermediateEvent'].includes(event.type)
          ) {
            throw new Error(`Invalid event type: ${event.type}`);
          }
          if (!event.label) {
            throw new Error('Event missing label');
          }
        }
      }

      // Valider les gateways
      if (parsed.gateways) {
        for (const gateway of parsed.gateways) {
          if (
            !gateway.type ||
            !['exclusiveGateway', 'parallelGateway', 'inclusiveGateway'].includes(gateway.type)
          ) {
            throw new Error(`Invalid gateway type: ${gateway.type}`);
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
