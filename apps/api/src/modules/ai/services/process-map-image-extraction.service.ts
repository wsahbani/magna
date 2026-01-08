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
import * as fs from 'fs';
import * as path from 'path';

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
      // Appeler l'IA avec vision avec retry logic pour JSON invalide
      this.logger.log('Calling OpenAI Vision API for image extraction');
      
      const MAX_RETRIES = 3;
      let attempt = 0;
      let lastError: Error | null = null;
      
      while (attempt < MAX_RETRIES) {
        attempt++;
        
        try {
          const response = await this.aiClient.generateFromImage(
            fullPrompt,
            imageBase64,
            mimeType,
            {
              maxTokens: 9000,
              temperature: attempt === 1 ? 0.7 : 0.5, // Lower temperature on retry for more deterministic output
              responseFormat: { type: 'json_object' }, // Force JSON mode
            },
          );

          // Mettre en cache
          this.cache.set(cacheKey, response.content, response.tokensUsed, response.model);

          // Parser la réponse - si ça échoue, on retry
          structure = this.parseAIResponse(response.content);
          tokensUsed = response.tokensUsed;
          model = response.model;
          
          this.logger.log(`Successfully parsed AI response on attempt ${attempt}`);
          break; // Success, exit retry loop
          
        } catch (error: any) {
          lastError = error;
          this.logger.warn(`Attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
          
          if (attempt >= MAX_RETRIES) {
            this.logger.error(`All ${MAX_RETRIES} attempts failed. Last error: ${error.message}`);
            throw new Error(
              `Failed to extract valid ProcessMap structure after ${MAX_RETRIES} attempts. ` +
              `Last error: ${error.message}. Please try again with a different image or description.`,
            );
          }
          
          // Wait before retry (exponential backoff: 500ms, 1s, 2s)
          const waitTime = Math.pow(2, attempt - 1) * 500;
          this.logger.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      
      // This should never happen due to the throw above, but TypeScript needs it
      if (!structure!) {
        throw lastError || new Error('Unknown error during image extraction');
      }
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
      
      // Remove markdown code blocks
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/```\n?/g, '');
      }
      
      // Try to extract JSON if there's text before/after
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }
      
      // Remove any BOM or invisible characters
      cleanedContent = cleanedContent.replace(/^\uFEFF/, '').trim();

      const parsed = JSON.parse(cleanedContent);

      // Validation basique
      if (!parsed.title || !parsed.groups || !Array.isArray(parsed.groups)) {
        throw new Error(
          `Invalid structure: missing title or groups. Got: ${JSON.stringify(Object.keys(parsed))}`,
        );
      }
      
      if (parsed.groups.length === 0) {
        throw new Error('Invalid structure: groups array is empty');
      }

      // Valider chaque groupe
      for (const group of parsed.groups) {
        if (!group.name) {
          throw new Error(
            `Invalid group structure: missing name. Got: ${JSON.stringify(Object.keys(group))}`,
          );
        }
        
        if (!Array.isArray(group.processes)) {
          throw new Error(
            `Invalid group structure: processes is not an array. Got type: ${typeof group.processes}`,
          );
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
      // Enhanced error logging
      this.logger.error(`Failed to parse AI response: ${error.message}`);
      
      // Write failed response to file for debugging
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logsDir = path.join(process.cwd(), 'logs', 'failed-ai-responses');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }
        
        const filename = `failed-response-${timestamp}.json`;
        const filepath = path.join(logsDir, filename);
        
        // Write debug information
        const debugInfo = {
          timestamp: new Date().toISOString(),
          error: error.message,
          errorType: error.constructor.name,
          contentLength: content.length,
          contentPreview: content.substring(0, 500),
          fullContent: content,
        };
        
        fs.writeFileSync(filepath, JSON.stringify(debugInfo, null, 2), 'utf-8');
        this.logger.error(`Failed AI response saved to: ${filepath}`);
      } catch (writeError: any) {
        this.logger.warn(`Failed to write debug file: ${writeError.message}`);
      }
      
      // Log first 1000 characters for debugging
      const preview = content.substring(0, 1000);
      this.logger.debug(`Response content preview (first 1000 chars): ${preview}`);
      
      // Try to identify the specific JSON parsing issue
      if (error instanceof SyntaxError) {
        // Extract line and column information if available
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const contextStart = Math.max(0, position - 50);
          const contextEnd = Math.min(content.length, position + 50);
          const context = content.substring(contextStart, contextEnd);
          this.logger.error(`JSON parse error at position ${position}: "${context}"`);
        }
        throw new Error(
          `Invalid JSON syntax in AI response: ${error.message}. ` +
          `This may be due to malformed JSON structure. The AI will retry with stricter formatting.`,
        );
      }
      
      // Re-throw with enhanced error message
      throw new Error(
        `Invalid AI response format: ${error.message}. ` +
        `Expected a valid ProcessMap structure with title, groups, and processes.`,
      );
    }
  }

  /**
   * Analyse une image pour détecter les processus sans créer de nodes
   * Retourne juste la liste des processus détectés
   */
  async analyzeImage(
    imageBase64: string,
    mimeType: string,
    contextType?: string,
    description?: string,
  ): Promise<{
    processes: Array<{ label: string; confidence?: number }>;
  }> {
    // Construire le prompt adapté au contexte
    let prompt: string;
    if (contextType === 'domainGroup') {
      // Pour un groupe de domaine, on veut juste extraire les noms de processus principaux
      prompt = `Analyze this process diagram image and extract ONLY the main process names.
Return a JSON object with a "processes" array containing objects with "label" and optional "confidence" fields.
Focus on extracting text labels from boxes/rectangles that represent main processes.
Do not include group names or container labels, only the actual process names.

Example output format:
{
  "processes": [
    { "label": "Gestion des commandes", "confidence": 0.95 },
    { "label": "Livraison", "confidence": 0.90 }
  ]
}`;
    } else {
      // Prompt générique pour extraction complète
      const { system, user } = buildExtractProcessMapFromImagePrompt(description);
      prompt = `${system}\n\n${user}`;
    }

    // Créer une clé de cache
    const imageHash = this.hashString(imageBase64.substring(0, 1000));
    const cacheKey = `image-analyze-${imageHash}-${contextType || 'generic'}-${description || 'no-desc'}`;

    // Vérifier le cache
    const cached = this.cache.get(cacheKey);
    let content: string;

    if (cached) {
      this.logger.log('Using cached response for image analysis');
      content = cached.content;
    } else {
      // Appeler l'IA avec vision
      this.logger.log('Calling OpenAI Vision API for image analysis');
      
      const MAX_RETRIES = 3;
      let attempt = 0;
      let lastError: Error | null = null;
      
      while (attempt < MAX_RETRIES) {
        attempt++;
        
        try {
          const response = await this.aiClient.generateFromImage(
            prompt,
            imageBase64,
            mimeType,
            {
              maxTokens: contextType === 'domainGroup' ? 2000 : 9000,
              temperature: attempt === 1 ? 0.7 : 0.5,
              responseFormat: { type: 'json_object' },
            },
          );

          // Mettre en cache
          this.cache.set(cacheKey, response.content, response.tokensUsed, response.model);
          content = response.content;
          break;
        } catch (error) {
          lastError = error;
          this.logger.error(`Attempt ${attempt}/${MAX_RETRIES} failed for image analysis:`, error.message);
          
          if (attempt >= MAX_RETRIES) {
            throw new Error(
              `Failed to analyze image after ${MAX_RETRIES} attempts. Last error: ${lastError.message}`,
            );
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    // Parser la réponse
    try {
      const parsed = JSON.parse(content);
      
      // Pour contextType='domainGroup', on s'attend à un format simple
      if (contextType === 'domainGroup') {
        if (!parsed.processes || !Array.isArray(parsed.processes)) {
          throw new Error('Response must contain a "processes" array');
        }
        
        return {
          processes: parsed.processes.map((p: any) => ({
            label: p.label || p.name || 'Process',
            confidence: p.confidence,
          })),
        };
      }
      
      // Pour le format complet ProcessMap, extraire tous les processus
      const structure = this.parseAIResponse(content);
      const processes: Array<{ label: string; confidence?: number }> = [];
      
      // Extraire les processus de tous les groupes
      for (const group of structure.groups || []) {
        for (const process of group.processes || []) {
          processes.push({
            label: process.label,
            confidence: 0.9, // Score par défaut
          });
        }
      }
      
      return { processes };
      
    } catch (error) {
      this.logger.error('Failed to parse image analysis response:', error.message);
      throw new Error(`Invalid response format: ${error.message}`);
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

