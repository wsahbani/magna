/**
 * Procedure AI Service
 * Service métier pour la génération IA de Procedure (niveau 3)
 */

import { Injectable, Logger } from '@nestjs/common';
import { AIClientService } from './ai-client.service';
import { AICacheService } from './ai-cache.service';
import { buildGenerateProcedurePrompt } from '../prompts/generate-procedure.prompt';
import type { ProcedureContext, GeneratedProcedureStructure } from '../interfaces/procedure.interface';
import { PrismaService } from '../../../database/prisma.service';
import { ProcedureService } from '../../procedure/services/procedure.service';
import { ProcedureFlowService } from '../../procedure/services/procedure-flow.service';
import { ProcedureStatus } from '@prisma/client';
import { SaveNodeDto } from '../../process/dto/save-flow.dto';

@Injectable()
export class ProcedureAIService {
  private readonly logger = new Logger(ProcedureAIService.name);

  constructor(
    private readonly aiClient: AIClientService,
    private readonly cache: AICacheService,
    private readonly prisma: PrismaService,
    private readonly procedureService: ProcedureService,
    private readonly procedureFlowService: ProcedureFlowService,
  ) {}

  /**
   * Génère une procédure à partir d'une description textuelle
   */
  async generateFromDescription(
    description: string,
    context: ProcedureContext,
  ): Promise<{
    structure: GeneratedProcedureStructure;
    tokensUsed: { prompt: number; completion: number; total: number };
    cost: number;
    cached: boolean;
  }> {
    // Récupérer les informations du Process, workspace et département
    const process = await this.prisma.process.findUnique({
      where: { id: context.processId },
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
    const { system, user } = buildGenerateProcedurePrompt(description, {
      processName: process?.title,
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
   * Crée une Procedure complète à partir d'une structure générée par IA
   * Inclut la Procedure, le FlowDiagram, et tous les nodes (événements, tâches, gateways)
   */
  async createProcedureFromAI(
    structure: GeneratedProcedureStructure,
    processId: string,
    workspaceId: string | undefined,
    departmentId: string | undefined,
    code: string | undefined,
    userId: string,
  ) {
    // Récupérer le Process pour obtenir workspaceId et departmentId si non fournis
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
      select: { workspaceId: true, departmentId: true },
    });

    if (!process) {
      throw new Error(`Process with ID "${processId}" not found`);
    }

    const finalWorkspaceId = workspaceId || process.workspaceId;
    const finalDepartmentId = departmentId || process.departmentId || undefined;

    // Générer un code si non fourni
    const procedureCode =
      code ||
      `PROC-${structure.title
        .substring(0, 10)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

    // Créer la Procedure
    const procedure = await this.procedureService.create(
      {
        title: structure.title,
        code: procedureCode,
        description: structure.description,
        processId,
        workspaceId: finalWorkspaceId,
        departmentId: finalDepartmentId,
        objective: undefined,
        scope: undefined,
      },
      userId,
    );

    // Transformer la structure IA en nodes ReactFlow
    const nodes: SaveNodeDto[] = [];
    const edges: any[] = [];

    // Valeurs par défaut
    const DEFAULT_TASK_WIDTH = 160;
    const DEFAULT_TASK_HEIGHT = 70;
    const DEFAULT_EVENT_SIZE = 45;
    const DEFAULT_GATEWAY_SIZE = 55;
    const START_X = 100;
    const START_Y = 200;
    let currentX = START_X;

    const uniquePrefix = `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Créer les événements de début
    const startEvents = structure.startEvents || [];
    if (startEvents.length > 0) {
      const startEvent = startEvents[0];
      const x = startEvent.position?.x ?? currentX;
      const y = startEvent.position?.y ?? START_Y;
      const size = startEvent.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      nodes.push({
        id: `${uniquePrefix}-startEvent`,
        type: startEvent.type,
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
      // Créer un startEvent par défaut
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

    // Créer les tâches
    structure.tasks?.forEach((task, index) => {
      const x = task.position?.x ?? currentX;
      const y = task.position?.y ?? START_Y;
      const width = task.dimensions?.width ?? DEFAULT_TASK_WIDTH;
      const height = task.dimensions?.height ?? DEFAULT_TASK_HEIGHT;
      nodes.push({
        id: `${uniquePrefix}-task-${index}`,
        type: task.type,
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
    structure.intermediateEvents?.forEach((event, index) => {
      const x = event.position?.x ?? currentX;
      const y = event.position?.y ?? START_Y;
      const size = event.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      nodes.push({
        id: `${uniquePrefix}-intermediateEvent-${index}`,
        type: event.type,
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

    // Créer les événements de fin
    const endEvents = structure.endEvents || [];
    if (endEvents.length > 0) {
      const endEvent = endEvents[0];
      const x = endEvent.position?.x ?? currentX;
      const y = endEvent.position?.y ?? START_Y;
      const size = endEvent.dimensions?.width ?? DEFAULT_EVENT_SIZE;
      nodes.push({
        id: `${uniquePrefix}-endEvent`,
        type: endEvent.type,
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
      // Créer un endEvent par défaut
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
    await this.procedureFlowService.saveFlow(
      {
        procedureId: procedure.id,
        nodes,
        edges,
      },
      userId,
    );

    return procedure;
  }

  /**
   * Parse la réponse JSON de l'IA et valide la structure
   */
  private parseAIResponse(content: string): GeneratedProcedureStructure {
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
      const hasStartEvents = parsed.startEvents && Array.isArray(parsed.startEvents) && parsed.startEvents.length > 0;
      const hasEndEvents = parsed.endEvents && Array.isArray(parsed.endEvents) && parsed.endEvents.length > 0;
      const hasTasks = parsed.tasks && Array.isArray(parsed.tasks) && parsed.tasks.length > 0;
      const hasIntermediateEvents = parsed.intermediateEvents && Array.isArray(parsed.intermediateEvents) && parsed.intermediateEvents.length > 0;
      const hasGateways = parsed.gateways && Array.isArray(parsed.gateways) && parsed.gateways.length > 0;

      if (!hasStartEvents && !hasEndEvents && !hasTasks && !hasIntermediateEvents && !hasGateways) {
        throw new Error('Invalid structure: must have at least startEvents, endEvents, tasks, intermediateEvents, or gateways');
      }

      // Valider les événements de début
      if (parsed.startEvents) {
        for (const event of parsed.startEvents) {
          if (
            !event.type ||
            !['startEvent', 'timerStartEvent', 'messageStartEvent', 'signalStartEvent', 'errorStartEvent'].includes(event.type)
          ) {
            throw new Error(`Invalid start event type: ${event.type}`);
          }
          if (!event.label) {
            throw new Error('Start event missing label');
          }
        }
      }

      // Valider les événements de fin
      if (parsed.endEvents) {
        for (const event of parsed.endEvents) {
          if (
            !event.type ||
            !['endEvent', 'messageEndEvent', 'errorEndEvent', 'cancelEndEvent', 'terminateEndEvent'].includes(event.type)
          ) {
            throw new Error(`Invalid end event type: ${event.type}`);
          }
          if (!event.label) {
            throw new Error('End event missing label');
          }
        }
      }

      // Valider les événements intermédiaires
      if (parsed.intermediateEvents) {
        for (const event of parsed.intermediateEvents) {
          if (
            !event.type ||
            !['intermediateEvent', 'timerEvent', 'messageEvent', 'signalEvent', 'errorEvent'].includes(event.type)
          ) {
            throw new Error(`Invalid intermediate event type: ${event.type}`);
          }
          if (!event.label) {
            throw new Error('Intermediate event missing label');
          }
        }
      }

      // Valider les tâches
      if (parsed.tasks) {
        for (const task of parsed.tasks) {
          if (
            !task.type ||
            !['task', 'userTask', 'serviceTask', 'manualTask', 'scriptTask'].includes(task.type)
          ) {
            throw new Error(`Invalid task type: ${task.type}`);
          }
          if (!task.label) {
            throw new Error('Task missing label');
          }
        }
      }

      // Valider les gateways
      if (parsed.gateways) {
        for (const gateway of parsed.gateways) {
          if (
            !gateway.type ||
            !['exclusiveGateway', 'parallelGateway', 'inclusiveGateway', 'eventBasedGateway'].includes(gateway.type)
          ) {
            throw new Error(`Invalid gateway type: ${gateway.type}`);
          }
        }
      }

      return parsed as GeneratedProcedureStructure;
    } catch (error: any) {
      this.logger.error(`Failed to parse AI response: ${error.message}`);
      this.logger.debug(`Response content: ${content.substring(0, 500)}`);
      throw new Error(`Invalid AI response format: ${error.message}`);
    }
  }
}

