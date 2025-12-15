/**
 * ProcessMap AI Service
 * Service métier pour la génération IA de ProcessMap
 */

import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { AIClientService } from './ai-client.service';
import { AICacheService } from './ai-cache.service';
import { buildGenerateProcessMapPrompt } from '../prompts/generate-process-map.prompt';
import type {
  ProcessMapContext,
  GeneratedProcessMapStructure,
} from '../interfaces/ai.interface';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessMapService } from '../../process-map/services/process-map.service';
import { ProcessMapFlowService } from '../../process-map/services/process-map-flow.service';
import { ProcessStatus } from '@prisma/client';
import { SaveNodeDto } from '../../process/dto/save-flow.dto';

@Injectable()
export class ProcessMapAIService {
  private readonly logger = new Logger(ProcessMapAIService.name);

  constructor(
    private readonly aiClient: AIClientService,
    private readonly cache: AICacheService,
    private readonly prisma: PrismaService,
    private readonly processMapService: ProcessMapService,
    private readonly processMapFlowService: ProcessMapFlowService,
  ) {}

  /**
   * Génère une carte de processus à partir d'une description textuelle
   */
  async generateFromDescription(
    description: string,
    context: ProcessMapContext,
  ): Promise<{
    structure: GeneratedProcessMapStructure;
    tokensUsed: { prompt: number; completion: number; total: number };
    cost: number;
    cached: boolean;
  }> {
    // Récupérer les informations du workspace et département
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

    // Récupérer les ProcessMap existants pour contexte
    const existingProcessMaps = await this.prisma.processMap.findMany({
      where: { workspaceId: context.workspaceId },
      select: { title: true, description: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // Construire le prompt
    const { system, user } = buildGenerateProcessMapPrompt(description, {
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
      maxTokens: 2000,
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
   * Crée une ProcessMap complète à partir d'une structure générée par IA
   * Inclut la ProcessMap, le FlowDiagram, et tous les nodes (groupes + processus)
   */
  async createProcessMapFromAI(
    structure: GeneratedProcessMapStructure,
    workspaceId: string,
    departmentId: string | undefined,
    code: string | undefined,
    userId: string,
  ) {
    // Générer un code si non fourni
    const processMapCode =
      code ||
      `MAP-${structure.title
        .substring(0, 10)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

    // Créer la ProcessMap
    const processMap = await this.processMapService.create(
      {
        title: structure.title,
        code: processMapCode,
        description: structure.description,
        workspaceId,
        departmentId,
        status: ProcessStatus.DRAFT,
      },
      userId,
    );

    // Transformer la structure IA en nodes ReactFlow
    const nodes: SaveNodeDto[] = [];
    const edges: any[] = [];

    // Constantes pour le positionnement
    const GROUP_WIDTH = 400;
    const GROUP_HEIGHT = 300;
    const GROUP_SPACING = 100;
    const PROCESS_WIDTH = 140;
    const PROCESS_HEIGHT = 80;
    const PROCESS_SPACING = 20;
    const START_X = 100;
    const START_Y = 100;

    // Générer un préfixe unique basé sur le timestamp et un random pour éviter les collisions
    const uniquePrefix = `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Créer les nodes de groupes et leurs processus
    structure.groups.forEach((group, groupIndex) => {
      const groupX = START_X + groupIndex * (GROUP_WIDTH + GROUP_SPACING);
      const groupY = START_Y;

      // Créer le node groupe avec un ID unique
      const groupNodeId = `${uniquePrefix}-domainGroup-${groupIndex}`;
      nodes.push({
        id: groupNodeId,
        type: 'domainGroup',
        label: group.name,
        description: group.description,
        positionX: groupX,
        positionY: groupY,
        width: GROUP_WIDTH,
        height: GROUP_HEIGHT,
        data: {
          description: group.description,
        },
      });

      // Créer les processus dans le groupe
      group.processes.forEach((process, processIndex) => {
        // ID unique pour chaque process node
        const processNodeId = `${uniquePrefix}-domainGroup-${groupIndex}-process-${processIndex}`;
        // Position relative au groupe (centré horizontalement, espacés verticalement)
        const processX = groupX + GROUP_WIDTH / 2 - PROCESS_WIDTH / 2;
        const processY =
          groupY +
          60 + // Header du groupe
          processIndex * (PROCESS_HEIGHT + PROCESS_SPACING);

        nodes.push({
          id: processNodeId,
          type: process.type,
          label: process.label,
          description: process.description,
          positionX: processX,
          positionY: processY,
          width: PROCESS_WIDTH,
          height: PROCESS_HEIGHT,
          parentId: groupNodeId, // Attaché au groupe
          data: {
            description: process.description,
          },
        });
      });
    });

    // Sauvegarder le flow avec tous les nodes
    await this.processMapFlowService.saveFlow(
      {
        processMapId: processMap.id,
        nodes,
        edges,
      },
      userId,
    );

    return processMap;
  }
}

