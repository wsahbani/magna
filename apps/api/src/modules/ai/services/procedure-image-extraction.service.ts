/**
 * Procedure Image Extraction Service
 * Service pour extraire une Procedure depuis une image avec IA vision
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AIClientService } from './ai-client.service';
import { AICacheService } from './ai-cache.service';
import { buildExtractProcedureFromImagePrompt } from '../prompts/extract-procedure-from-image.prompt';
import type { GeneratedProcedureStructure } from '../interfaces/procedure.interface';
import { PrismaService } from '../../../database/prisma.service';
import { ProcedureFlowService } from '../../procedure/services/procedure-flow.service';
import { SaveNodeDto } from '../../process/dto/save-flow.dto';

@Injectable()
export class ProcedureImageExtractionService {
  private readonly logger = new Logger(ProcedureImageExtractionService.name);

  constructor(
    private readonly aiClient: AIClientService,
    private readonly cache: AICacheService,
    private readonly prisma: PrismaService,
    private readonly procedureFlowService: ProcedureFlowService,
  ) {}

  /**
   * Extrait une Procedure depuis une image
   * Crée ou met à jour les nodes du flow selon replaceExisting
   */
  async extractProcedureFromImage(
    imageBase64: string,
    mimeType: string,
    procedureId: string,
    replaceExisting: boolean,
    description: string | undefined,
    userId: string,
  ): Promise<{
    structure: GeneratedProcedureStructure;
    nodesCreated: number;
    startEventsCreated: number;
    endEventsCreated: number;
    intermediateEventsCreated: number;
    tasksCreated: number;
    gatewaysCreated: number;
  }> {
    // Vérifier que la Procedure existe
    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
      select: { id: true },
    });
    if (!procedure) {
      throw new NotFoundException(`Procedure with ID "${procedureId}" not found`);
    }

    // Construire le prompt
    const { system, user } = buildExtractProcedureFromImagePrompt(description);
    const fullPrompt = `${system}\n\n${user}`;

    // Créer une clé de cache basée sur l'image (hash du base64)
    const imageHash = this.hashString(imageBase64.substring(0, 1000));
    const cacheKey = `image-extract-procedure-${imageHash}-${description || 'no-desc'}`;

    // Vérifier le cache
    const cached = this.cache.get(cacheKey);
    let structure: GeneratedProcedureStructure;
    let tokensUsed: { prompt: number; completion: number; total: number };
    let model: string;

    if (cached) {
      this.logger.log('Using cached response for image extraction');
      structure = this.parseAIResponse(cached.content);
      tokensUsed = cached.tokensUsed;
      model = cached.model;
    } else {
      // Appeler l'IA avec vision
      this.logger.log('Calling OpenAI Vision API for image extraction');
      const response = await this.aiClient.generateFromImage(
        fullPrompt,
        imageBase64,
        mimeType,
        {
          maxTokens: 2500, // Limité pour rester dans le budget
          temperature: 0.7,
        },
      );

      // Mettre en cache
      this.cache.set(cacheKey, response.content, response.tokensUsed, response.model);

      // Parser la réponse
      structure = this.parseAIResponse(response.content);
      tokensUsed = response.tokensUsed;
      model = response.model;
    }

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

    const uniquePrefix = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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

    // Si replaceExisting, supprimer les nodes existants d'abord
    if (replaceExisting) {
      this.logger.log('Replacing existing nodes in Procedure');
      const currentFlow = await this.procedureFlowService.getFlow(procedureId);
      if (currentFlow && currentFlow.nodes && currentFlow.nodes.length > 0) {
        await this.procedureFlowService.saveFlow(
          {
            procedureId,
            nodes: [],
            edges: [],
          },
          userId,
        );
      }
    }

    // Sauvegarder le flow avec tous les nouveaux nodes
    await this.procedureFlowService.saveFlow(
      {
        procedureId,
        nodes,
        edges,
      },
      userId,
    );

    const startEventsCreated = structure.startEvents?.length || 0;
    const endEventsCreated = structure.endEvents?.length || 0;
    const intermediateEventsCreated = structure.intermediateEvents?.length || 0;
    const tasksCreated = structure.tasks?.length || 0;
    const gatewaysCreated = structure.gateways?.length || 0;
    const nodesCreated = nodes.length;

    this.logger.log(
      `Image extraction completed: ${startEventsCreated} start events, ${endEventsCreated} end events, ${intermediateEventsCreated} intermediate events, ${tasksCreated} tasks, ${gatewaysCreated} gateways, ${nodesCreated} nodes`,
    );

    return {
      structure,
      nodesCreated,
      startEventsCreated,
      endEventsCreated,
      intermediateEventsCreated,
      tasksCreated,
      gatewaysCreated,
    };
  }

  /**
   * Parse la réponse JSON de l'IA et valide la structure
   */
  private parseAIResponse(content: string): GeneratedProcedureStructure {
    try {
      // Nettoyer le contenu
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

  /**
   * Hash simple d'une string pour le cache
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

