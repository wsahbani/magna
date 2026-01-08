/**
 * AI Controller
 * Endpoints pour les fonctionnalités IA
 */

import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProcessMapAIService } from './services/process-map-ai.service';
import { ProcessMapImageExtractionService } from './services/process-map-image-extraction.service';
import { ProcessAIService } from './services/process-ai.service';
import { ProcessImageExtractionService } from './services/process-image-extraction.service';
import { ProcedureAIService } from './services/procedure-ai.service';
import { ProcedureImageExtractionService } from './services/procedure-image-extraction.service';
import { GenerateProcessMapDto } from './dto/generate-process-map.dto';
import { GenerateProcessMapResponseDto } from './dto/ai-response.dto';
import { CreateProcessMapFromAIDto } from './dto/create-process-map-from-ai.dto';
import { ExtractProcessMapFromImageDto } from './dto/extract-process-map-from-image.dto';
import { GenerateProcessDto } from './dto/generate-process.dto';
import { GenerateProcessResponseDto } from './dto/process-response.dto';
import { CreateProcessFromAIDto } from './dto/create-process-from-ai.dto';
import { ExtractProcessFromImageDto } from './dto/extract-process-from-image.dto';
import { GenerateProcedureDto } from './dto/generate-procedure.dto';
import { GenerateProcedureResponseDto } from './dto/procedure-response.dto';
import { CreateProcedureFromAIDto } from './dto/create-procedure-from-ai.dto';
import { ExtractProcedureFromImageDto } from './dto/extract-procedure-from-image.dto';
import { AICacheService } from './services/ai-cache.service';
import { memoryStorage } from 'multer';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {
  constructor(
    private readonly processMapAIService: ProcessMapAIService,
    private readonly processMapImageExtractionService: ProcessMapImageExtractionService,
    private readonly processAIService: ProcessAIService,
    private readonly processImageExtractionService: ProcessImageExtractionService,
    private readonly procedureAIService: ProcedureAIService,
    private readonly procedureImageExtractionService: ProcedureImageExtractionService,
    private readonly cacheService: AICacheService,
  ) {}

  @Post('process-map/generate')
  @ApiOperation({
    summary: 'Génère une carte de processus à partir d une description textuelle',
    description:
      'Utilise l IA pour générer automatiquement une structure de ProcessMap avec groupes et processus',
  })
  @ApiResponse({
    status: 200,
    description: 'Structure générée avec succès',
    type: GenerateProcessMapResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la génération IA' })
  async generateProcessMap(
    @Body() dto: GenerateProcessMapDto,
    @Request() req: any,
  ): Promise<GenerateProcessMapResponseDto> {
    const result = await this.processMapAIService.generateFromDescription(dto.description, {
      workspaceId: dto.workspaceId,
      departmentId: dto.departmentId,
    });

    return {
      structure: result.structure,
      estimatedCost: result.cost,
      cached: result.cached,
      tokensUsed: result.tokensUsed,
    };
  }

  @Post('process-map/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crée une ProcessMap complète à partir d une structure générée par IA',
    description:
      'Crée la ProcessMap, le FlowDiagram et tous les nodes (groupes et processus) automatiquement',
  })
  @ApiResponse({
    status: 201,
    description: 'ProcessMap créée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la création' })
  async createProcessMapFromAI(
    @Body() dto: CreateProcessMapFromAIDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub || 'system';
    return this.processMapAIService.createProcessMapFromAI(
      dto.structure,
      dto.workspaceId,
      dto.departmentId,
      dto.code,
      userId,
    );
  }

  @Post('process-map/extract-from-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        // Accepter tous les formats image standards
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/webp',
          'image/gif',
          'image/bmp',
          'image/svg+xml',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Format d'image non supporté. Formats acceptés: PNG, JPG, WEBP, GIF, BMP, SVG`,
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Extrait une ProcessMap depuis une image avec IA vision',
    description:
      'Analyse une image contenant une carte de processus et extrait automatiquement les groupes et processus',
  })
  @ApiResponse({
    status: 200,
    description: 'ProcessMap extraite avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide - format ou taille d\'image invalide' })
  @ApiResponse({ status: 404, description: 'ProcessMap non trouvée' })
  @ApiResponse({ status: 500, description: 'Erreur lors de l\'extraction' })
  async extractProcessMapFromImage(
    @UploadedFile() file: any,
    @Body('processMapId') processMapId: string,
    @Body('replaceExisting') replaceExisting?: string,
    @Body('description') description?: string,
    @Request() req?: any,
  ) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    if (!processMapId) {
      throw new BadRequestException('processMapId est requis');
    }

    // Convertir le fichier en base64
    const imageBase64 = file.buffer.toString('base64');
    const userId = req?.user?.id || req?.user?.sub || 'system';
    const shouldReplace = replaceExisting === 'true';

    const result = await this.processMapImageExtractionService.extractProcessMapFromImage(
      imageBase64,
      file.mimetype,
      processMapId,
      shouldReplace,
      description,
      userId,
    );

    return {
      success: true,
      message: 'ProcessMap extraite avec succès depuis l\'image',
      data: {
        structure: result.structure,
        nodesCreated: result.nodesCreated,
        groupsCreated: result.groupsCreated,
        processesCreated: result.processesCreated,
      },
    };
  }

  @Post('process-map/analyze')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/webp',
          'image/gif',
          'image/bmp',
          'image/svg+xml',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Format d'image non supporté. Formats acceptés: PNG, JPG, WEBP, GIF, BMP, SVG`,
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Analyse une image pour détecter les processus (sans créer de nodes)',
    description:
      'Utilise l\'IA vision pour analyser une image et retourner les processus détectés. Ne crée pas de nodes dans la base de données.',
  })
  @ApiResponse({
    status: 200,
    description: 'Image analysée avec succès',
    schema: {
      properties: {
        success: { type: 'boolean' },
        processes: {
          type: 'array',
          items: {
            properties: {
              label: { type: 'string' },
              confidence: { type: 'number', description: 'Score de confiance entre 0 et 1' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Requête invalide - format ou taille d\'image invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de l\'analyse' })
  async analyzeProcessMapImage(
    @UploadedFile() file: any,
    @Body('contextType') contextType?: string,
    @Body('processMapId') processMapId?: string,
    @Body('description') description?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    // Convertir le fichier en base64
    const imageBase64 = file.buffer.toString('base64');

    // Analyser l'image avec l'IA
    const result = await this.processMapImageExtractionService.analyzeImage(
      imageBase64,
      file.mimetype,
      contextType,
      description,
    );

    return {
      success: true,
      processes: result.processes,
    };
  }

  @Post('process/generate')
  @ApiOperation({
    summary: 'Génère un processus à partir d une description textuelle',
    description:
      'Utilise l IA pour générer automatiquement une structure de Process avec procédures, tâches, événements et gateways',
  })
  @ApiResponse({
    status: 200,
    description: 'Structure générée avec succès',
    type: GenerateProcessResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la génération IA' })
  async generateProcess(
    @Body() dto: GenerateProcessDto,
    @Request() req: any,
  ): Promise<GenerateProcessResponseDto> {
    const result = await this.processAIService.generateFromDescription(dto.description, {
      processMapId: dto.processMapId,
      workspaceId: dto.workspaceId || '',
      departmentId: dto.departmentId,
      flowDirection: dto.flowDirection || 'horizontal',
    });

    return {
      structure: result.structure,
      estimatedCost: result.cost,
      cached: result.cached,
      tokensUsed: result.tokensUsed,
    };
  }

  @Post('process/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crée un Process complet à partir d une structure générée par IA',
    description:
      'Crée le Process, le FlowDiagram et tous les nodes (procédures, tâches, événements, gateways) automatiquement',
  })
  @ApiResponse({
    status: 201,
    description: 'Process créé avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la création' })
  async createProcessFromAI(
    @Body() dto: CreateProcessFromAIDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub || 'system';
    return this.processAIService.createProcessFromAI(
      dto.structure,
      dto.processMapId,
      dto.workspaceId,
      dto.departmentId,
      dto.code,
      userId,
      dto.flowDirection || 'horizontal',
    );
  }

  @Post('process/extract-from-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/webp',
          'image/gif',
          'image/bmp',
          'image/svg+xml',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Format d'image non supporté. Formats acceptés: PNG, JPG, WEBP, GIF, BMP, SVG`,
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Extrait un Process depuis une image avec IA vision',
    description:
      'Analyse une image contenant un diagramme de processus et extrait automatiquement les procédures, tâches, événements et gateways',
  })
  @ApiResponse({
    status: 200,
    description: 'Process extrait avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide - format ou taille d\'image invalide' })
  @ApiResponse({ status: 404, description: 'Process non trouvé' })
  @ApiResponse({ status: 500, description: 'Erreur lors de l\'extraction' })
  async extractProcessFromImage(
    @UploadedFile() file: any,
    @Body('processId') processId: string,
    @Body('replaceExisting') replaceExisting?: string,
    @Body('description') description?: string,
    @Request() req?: any,
  ) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    if (!processId) {
      throw new BadRequestException('processId est requis');
    }

    const imageBase64 = file.buffer.toString('base64');
    const userId = req?.user?.id || req?.user?.sub || 'system';
    const shouldReplace = replaceExisting === 'true';

    const result = await this.processImageExtractionService.extractProcessFromImage(
      imageBase64,
      file.mimetype,
      processId,
      shouldReplace,
      description,
      userId,
    );

    return {
      success: true,
      message: 'Process extrait avec succès depuis l\'image',
      data: {
        structure: result.structure,
        nodesCreated: result.nodesCreated,
        proceduresCreated: result.proceduresCreated,
        tasksCreated: result.tasksCreated,
        eventsCreated: result.eventsCreated,
        gatewaysCreated: result.gatewaysCreated,
      },
    };
  }

  @Post('procedure/generate')
  @ApiOperation({
    summary: 'Génère une procédure à partir d une description textuelle',
    description:
      'Utilise l IA pour générer automatiquement une structure de Procedure avec événements, tâches et gateways BPMN',
  })
  @ApiResponse({
    status: 200,
    description: 'Structure générée avec succès',
    type: GenerateProcedureResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la génération IA' })
  async generateProcedure(
    @Body() dto: GenerateProcedureDto,
    @Request() req: any,
  ): Promise<GenerateProcedureResponseDto> {
    const result = await this.procedureAIService.generateFromDescription(dto.description, {
      processId: dto.processId,
      workspaceId: dto.workspaceId || '',
      departmentId: dto.departmentId,
    });

    return {
      structure: result.structure,
      estimatedCost: result.cost,
      cached: result.cached,
      tokensUsed: result.tokensUsed,
    };
  }

  @Post('procedure/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crée une Procedure complète à partir d une structure générée par IA',
    description:
      'Crée la Procedure, le FlowDiagram et tous les nodes (événements, tâches, gateways) automatiquement',
  })
  @ApiResponse({
    status: 201,
    description: 'Procedure créée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 500, description: 'Erreur lors de la création' })
  async createProcedureFromAI(
    @Body() dto: CreateProcedureFromAIDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || req.user?.sub || 'system';
    return this.procedureAIService.createProcedureFromAI(
      dto.structure,
      dto.processId,
      dto.workspaceId,
      dto.departmentId,
      dto.code,
      userId,
    );
  }

  @Post('procedure/extract-from-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/webp',
          'image/gif',
          'image/bmp',
          'image/svg+xml',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Format d'image non supporté. Formats acceptés: PNG, JPG, WEBP, GIF, BMP, SVG`,
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Extrait une Procedure depuis une image avec IA vision',
    description:
      'Analyse une image contenant un diagramme BPMN et extrait automatiquement les événements, tâches et gateways',
  })
  @ApiResponse({
    status: 200,
    description: 'Procedure extraite avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide - format ou taille d\'image invalide' })
  @ApiResponse({ status: 404, description: 'Procedure non trouvée' })
  @ApiResponse({ status: 500, description: 'Erreur lors de l\'extraction' })
  async extractProcedureFromImage(
    @UploadedFile() file: any,
    @Body('procedureId') procedureId: string,
    @Body('replaceExisting') replaceExisting?: string,
    @Body('description') description?: string,
    @Request() req?: any,
  ) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    if (!procedureId) {
      throw new BadRequestException('procedureId est requis');
    }

    const imageBase64 = file.buffer.toString('base64');
    const userId = req?.user?.id || req?.user?.sub || 'system';
    const shouldReplace = replaceExisting === 'true';

    const result = await this.procedureImageExtractionService.extractProcedureFromImage(
      imageBase64,
      file.mimetype,
      procedureId,
      shouldReplace,
      description,
      userId,
    );

    return {
      success: true,
      message: 'Procedure extraite avec succès depuis l\'image',
      data: {
        structure: result.structure,
        nodesCreated: result.nodesCreated,
        startEventsCreated: result.startEventsCreated,
        endEventsCreated: result.endEventsCreated,
        intermediateEventsCreated: result.intermediateEventsCreated,
        tasksCreated: result.tasksCreated,
        gatewaysCreated: result.gatewaysCreated,
      },
    };
  }

  @Get('cache/stats')
  @ApiOperation({
    summary: 'Statistiques du cache IA',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques du cache',
  })
  getCacheStats() {
    return this.cacheService.getStats();
  }
}

