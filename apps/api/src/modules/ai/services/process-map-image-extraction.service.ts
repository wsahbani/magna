/**
 * ProcessMap Image Extraction Service
 * Service pour extraire une ProcessMap depuis une image avec IA vision
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AIClientService } from './ai-client.service';
import { AICacheService } from './ai-cache.service';
import { buildExtractProcessMapFromImagePrompt } from '../prompts/extract-process-map-from-image.prompt';
import type { GeneratedProcessMapStructure } from '../interfaces/ai.interface';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessMapService } from '../../process-map/services/process-map.service';
import { ProcessMapFlowService } from '../../process-map/services/process-map-flow.service';
import { SaveNodeDto } from '../../process/dto/save-flow.dto';

@Injectable()
export class ProcessMapImageExtractionService {
  private readonly logger = new Logger(ProcessMapImageExtractionService.name);

  constructor(
    private readonly aiClient: AIClientService,
    private readonly cache: AICacheService,
    private readonly prisma: PrismaService,
    private readonly processMapService: ProcessMapService,
    private readonly processMapFlowService: ProcessMapFlowService,
  ) {}

  /**
   * Extrait une ProcessMap depuis une image
   * Crée ou met à jour les nodes du flow selon replaceExisting
   */
  async extractProcessMapFromImage(
    imageBase64: string,
    mimeType: string,
    processMapId: string,
    replaceExisting: boolean,
    description: string | undefined,
    userId: string,
  ): Promise<{
    structure: GeneratedProcessMapStructure;
    nodesCreated: number;
    groupsCreated: number;
    processesCreated: number;
  }> {
    // Vérifier que la ProcessMap existe
    const processMap = await this.processMapService.findOne(processMapId);
    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID "${processMapId}" not found`);
    }

    // Construire le prompt
    const { system, user } = buildExtractProcessMapFromImagePrompt(description);
    const fullPrompt = `${system}\n\n${user}`;

    // Créer une clé de cache basée sur l'image (hash du base64)
    const imageHash = this.hashString(imageBase64.substring(0, 1000)); // Hash des premiers caractères pour performance
    const cacheKey = `image-extract-${imageHash}-${description || 'no-desc'}`;

    // Vérifier le cache
    const cached = this.cache.get(cacheKey);
    let structure: GeneratedProcessMapStructure;
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
          maxTokens: 3000, // Plus de tokens pour les images
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
    const DEFAULT_GROUP_WIDTH = 400;
    const DEFAULT_GROUP_HEIGHT = 300;
    const DEFAULT_GROUP_SPACING = 100;
    const DEFAULT_PROCESS_WIDTH = 140;
    const DEFAULT_PROCESS_HEIGHT = 80;
    const DEFAULT_START_X = 100;
    const DEFAULT_START_Y = 100;

    // Générer un préfixe unique basé sur le timestamp et un random pour éviter les collisions
    const uniquePrefix = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Créer les nodes de groupes et leurs processus
    structure.groups.forEach((group, groupIndex) => {
      // Utiliser les positions/dimensions de l'IA ou calculer automatiquement
      const groupX = group.position?.x ?? DEFAULT_START_X + groupIndex * (DEFAULT_GROUP_WIDTH + DEFAULT_GROUP_SPACING);
      const groupY = group.position?.y ?? DEFAULT_START_Y;
      const groupWidth = group.dimensions?.width ?? DEFAULT_GROUP_WIDTH;
      const groupHeight = group.dimensions?.height ?? DEFAULT_GROUP_HEIGHT;

      // Créer le node groupe avec un ID unique
      const groupNodeId = `${uniquePrefix}-domainGroup-${groupIndex}`;
      nodes.push({
        id: groupNodeId,
        type: 'domainGroup',
        label: group.name,
        description: group.description,
        positionX: groupX,
        positionY: groupY,
        width: groupWidth,
        height: groupHeight,
        data: {
          description: group.description,
        },
      });

      // Créer les processus dans le groupe
      group.processes.forEach((process, processIndex) => {
        // ID unique pour chaque process node
        const processNodeId = `${uniquePrefix}-domainGroup-${groupIndex}-process-${processIndex}`;
        
        // Utiliser les positions/dimensions de l'IA ou calculer automatiquement
        let processX: number;
        let processY: number;
        
        if (process.position) {
          // Si l'IA a fourni une position, l'utiliser directement
          processX = process.position.x;
          processY = process.position.y;
        } else {
          // Sinon, calculer automatiquement (centré horizontalement, espacés verticalement)
          processX = groupX + groupWidth / 2 - (process.dimensions?.width ?? DEFAULT_PROCESS_WIDTH) / 2;
          processY = groupY + 60 + processIndex * ((process.dimensions?.height ?? DEFAULT_PROCESS_HEIGHT) + 20);
        }
        
        const processWidth = process.dimensions?.width ?? DEFAULT_PROCESS_WIDTH;
        const processHeight = process.dimensions?.height ?? DEFAULT_PROCESS_HEIGHT;

        nodes.push({
          id: processNodeId,
          type: process.type,
          label: process.label,
          description: process.description,
          positionX: processX,
          positionY: processY,
          width: processWidth,
          height: processHeight,
          parentId: groupNodeId, // Attaché au groupe
          data: {
            description: process.description,
          },
        });
      });
    });

    // Si replaceExisting, supprimer les nodes existants d'abord
    if (replaceExisting) {
      this.logger.log('Replacing existing nodes in ProcessMap');
      // Récupérer le flow actuel pour obtenir les nodes existants
      const currentFlow = await this.processMapFlowService.getFlow(processMapId);
      if (currentFlow && currentFlow.nodes && currentFlow.nodes.length > 0) {
        // Supprimer tous les nodes existants en envoyant un flow vide puis le nouveau
        await this.processMapFlowService.saveFlow(
          {
            processMapId,
            nodes: [],
            edges: [],
          },
          userId,
        );
      }
    }

    // Sauvegarder le flow avec tous les nouveaux nodes
    await this.processMapFlowService.saveFlow(
      {
        processMapId,
        nodes,
        edges,
      },
      userId,
    );

    const groupsCreated = structure.groups.length;
    const processesCreated = structure.groups.reduce(
      (sum, group) => sum + group.processes.length,
      0,
    );
    const nodesCreated = nodes.length;

    this.logger.log(
      `Image extraction completed: ${groupsCreated} groups, ${processesCreated} processes, ${nodesCreated} nodes`,
    );

    return {
      structure,
      nodesCreated,
      groupsCreated,
      processesCreated,
    };
  }

  /**
   * Parse la réponse JSON de l'IA et valide la structure
   */
  private parseAIResponse(content: string): GeneratedProcessMapStructure {
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
      if (!parsed.title || !parsed.groups || !Array.isArray(parsed.groups)) {
        throw new Error('Invalid structure: missing title or groups');
      }

      // Valider chaque groupe
      for (const group of parsed.groups) {
        if (!group.name || !Array.isArray(group.processes)) {
          throw new Error(`Invalid group structure: ${JSON.stringify(group)}`);
        }

        // Valider chaque processus
        for (const process of group.processes) {
          if (
            !process.type ||
            !['mainProcess', 'supportProcess', 'managementProcess'].includes(process.type)
          ) {
            throw new Error(`Invalid process type: ${process.type}`);
          }
          if (!process.label) {
            throw new Error('Process missing label');
          }
          // Valider les positions et dimensions si fournies
          if (process.position) {
            if (typeof process.position.x !== 'number' || typeof process.position.y !== 'number') {
              throw new Error(`Invalid process position: ${JSON.stringify(process.position)}`);
            }
          }
          if (process.dimensions) {
            if (typeof process.dimensions.width !== 'number' || typeof process.dimensions.height !== 'number') {
              throw new Error(`Invalid process dimensions: ${JSON.stringify(process.dimensions)}`);
            }
            // Valider que les dimensions sont raisonnables
            if (process.dimensions.width < 50 || process.dimensions.width > 500) {
              this.logger.warn(`Process width ${process.dimensions.width} is outside reasonable range, will use default`);
            }
            if (process.dimensions.height < 30 || process.dimensions.height > 300) {
              this.logger.warn(`Process height ${process.dimensions.height} is outside reasonable range, will use default`);
            }
          }
        }
        
        // Valider les positions et dimensions du groupe si fournies
        if (group.position) {
          if (typeof group.position.x !== 'number' || typeof group.position.y !== 'number') {
            throw new Error(`Invalid group position: ${JSON.stringify(group.position)}`);
          }
        }
        if (group.dimensions) {
          if (typeof group.dimensions.width !== 'number' || typeof group.dimensions.height !== 'number') {
            throw new Error(`Invalid group dimensions: ${JSON.stringify(group.dimensions)}`);
          }
          // Valider que les dimensions sont raisonnables
          if (group.dimensions.width < 200 || group.dimensions.width > 1000) {
            this.logger.warn(`Group width ${group.dimensions.width} is outside reasonable range, will use default`);
          }
          if (group.dimensions.height < 150 || group.dimensions.height > 800) {
            this.logger.warn(`Group height ${group.dimensions.height} is outside reasonable range, will use default`);
          }
        }
      }

      return parsed as GeneratedProcessMapStructure;
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
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

