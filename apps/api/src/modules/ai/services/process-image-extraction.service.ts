/**
 * Process Image Extraction Service
 * Service pour extraire un Process depuis une image avec IA vision
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AIClientService } from './ai-client.service';
import { AICacheService } from './ai-cache.service';
import { buildExtractProcessFromImagePrompt } from '../prompts/extract-process-from-image.prompt';
import type { GeneratedProcessStructure } from '../interfaces/process.interface';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessService } from '../../process/services/process.service';
import { ProcessFlowService } from '../../process/services/process-flow.service';
import { SaveNodeDto } from '../../process/dto/save-flow.dto';

@Injectable()
export class ProcessImageExtractionService {
  private readonly logger = new Logger(ProcessImageExtractionService.name);

  constructor(
    private readonly aiClient: AIClientService,
    private readonly cache: AICacheService,
    private readonly prisma: PrismaService,
    private readonly processService: ProcessService,
    private readonly processFlowService: ProcessFlowService,
  ) {}

  /**
   * Extrait un Process depuis une image
   * Crée ou met à jour les nodes du flow selon replaceExisting
   */
  async extractProcessFromImage(
    imageBase64: string,
    mimeType: string,
    processId: string,
    replaceExisting: boolean,
    description: string | undefined,
    userId: string,
  ): Promise<{
    structure: GeneratedProcessStructure;
    nodesCreated: number;
    proceduresCreated: number;
    tasksCreated: number;
    eventsCreated: number;
    gatewaysCreated: number;
  }> {
    // Vérifier que le Process existe
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
      select: { id: true },
    });
    if (!process) {
      throw new NotFoundException(`Process with ID "${processId}" not found`);
    }

    // Construire le prompt
    const { system, user } = buildExtractProcessFromImagePrompt(description);
    const fullPrompt = `${system}\n\n${user}`;

    // Créer une clé de cache basée sur l'image (hash du base64)
    const imageHash = this.hashString(imageBase64.substring(0, 1000));
    const cacheKey = `image-extract-process-${imageHash}-${description || 'no-desc'}`;

    // Vérifier le cache
    const cached = this.cache.get(cacheKey);
    let structure: GeneratedProcessStructure;
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
          maxTokens: 2500, // Limité pour rester dans le budget (utilisateur peut se permettre ~2859 tokens)
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

    // Valeurs par défaut si l'IA ne fournit pas les positions/dimensions
    const DEFAULT_PROCEDURE_WIDTH = 160;
    const DEFAULT_PROCEDURE_HEIGHT = 70;
    const DEFAULT_TASK_WIDTH = 140;
    const DEFAULT_TASK_HEIGHT = 60;
    const DEFAULT_EVENT_SIZE = 45;
    const DEFAULT_GATEWAY_SIZE = 55;
    const START_X = 100;
    const START_Y = 200;
    let currentX = START_X;

    // Générer un préfixe unique
    const uniquePrefix = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Créer les événements de début et fin en premier
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
      this.logger.log('Replacing existing nodes in Process');
      const currentFlow = await this.processFlowService.getFlow(processId);
      if (currentFlow && currentFlow.nodes && currentFlow.nodes.length > 0) {
        await this.processFlowService.saveFlow(
          {
            processId,
            nodes: [],
            edges: [],
          },
          userId,
        );
      }
    }

    // Sauvegarder le flow avec tous les nouveaux nodes
    await this.processFlowService.saveFlow(
      {
        processId,
        nodes,
        edges,
      },
      userId,
    );

    const proceduresCreated = structure.procedures?.length || 0;
    const tasksCreated = structure.tasks?.length || 0;
    const eventsCreated = structure.events?.length || 0;
    const gatewaysCreated = structure.gateways?.length || 0;
    const nodesCreated = nodes.length;

    this.logger.log(
      `Image extraction completed: ${proceduresCreated} procedures, ${tasksCreated} tasks, ${eventsCreated} events, ${gatewaysCreated} gateways, ${nodesCreated} nodes`,
    );

    return {
      structure,
      nodesCreated,
      proceduresCreated,
      tasksCreated,
      eventsCreated,
      gatewaysCreated,
    };
  }

  /**
   * Parse la réponse JSON de l'IA et valide la structure
   */
  private parseAIResponse(content: string): GeneratedProcessStructure {
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

      // Valider les procédures
      if (parsed.procedures) {
        for (const procedure of parsed.procedures) {
          if (!procedure.label) {
            throw new Error('Procedure missing label');
          }
          if (procedure.position) {
            if (typeof procedure.position.x !== 'number' || typeof procedure.position.y !== 'number') {
              throw new Error(`Invalid procedure position: ${JSON.stringify(procedure.position)}`);
            }
          }
          if (procedure.dimensions) {
            if (typeof procedure.dimensions.width !== 'number' || typeof procedure.dimensions.height !== 'number') {
              throw new Error(`Invalid procedure dimensions: ${JSON.stringify(procedure.dimensions)}`);
            }
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

