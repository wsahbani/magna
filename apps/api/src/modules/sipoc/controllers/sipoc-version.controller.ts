import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SipocVersionService } from '../services/sipoc-version.service';
import { CreateSipocVersionDto } from '../dto/create-sipoc-version.dto';
import { UpdateSipocVersionDto } from '../dto/update-sipoc-version.dto';
import { PublishVersionDto } from '../dto/publish-version.dto';

@Controller('sipoc/:sipocId/versions')
export class SipocVersionController {
  constructor(private readonly versionService: SipocVersionService) {}

  /**
   * Créer une nouvelle version draft
   * POST /sipoc/:sipocId/versions
   */
  @Post()
  async createVersion(
    @Param('sipocId') sipocId: string,
    @Body() dto: CreateSipocVersionDto,
  ) {
    // TODO: Récupérer l'ID utilisateur depuis le token JWT
    const userId = 'current-user-id';
    return this.versionService.createVersion(sipocId, dto, userId);
  }

  /**
   * Dupliquer une version existante
   * POST /sipoc/:sipocId/versions/:versionId/duplicate
   */
  @Post(':versionId/duplicate')
  async duplicateVersion(
    @Param('sipocId') sipocId: string,
    @Param('versionId') versionId: string,
    @Body() dto: CreateSipocVersionDto,
  ) {
    return this.versionService.duplicateVersion(sipocId, versionId, dto);
  }

  /**
   * Récupérer toutes les versions d'un SIPOC
   * GET /sipoc/:sipocId/versions
   */
  @Get()
  async getVersions(@Param('sipocId') sipocId: string) {
    return this.versionService.getVersions(sipocId);
  }

  /**
   * Récupérer une version spécifique
   * GET /sipoc/:sipocId/versions/:versionId
   */
  @Get(':versionId')
  async getVersion(@Param('versionId') versionId: string) {
    return this.versionService.getVersion(versionId);
  }

  /**
   * Mettre à jour une version draft
   * PUT /sipoc/:sipocId/versions/:versionId
   */
  @Put(':versionId')
  async updateVersion(
    @Param('versionId') versionId: string,
    @Body() dto: UpdateSipocVersionDto,
  ) {
    return this.versionService.updateVersion(versionId, dto);
  }

  /**
   * Publier une version draft
   * POST /sipoc/:sipocId/versions/:versionId/publish
   */
  @Post(':versionId/publish')
  async publishVersion(
    @Param('versionId') versionId: string,
    @Body() dto: PublishVersionDto,
  ) {
    return this.versionService.publishVersion(versionId, dto);
  }

  /**
   * Archiver une version publiée
   * POST /sipoc/:sipocId/versions/:versionId/archive
   */
  @Post(':versionId/archive')
  async archiveVersion(@Param('versionId') versionId: string) {
    return this.versionService.archiveVersion(versionId);
  }

  /**
   * Supprimer une version draft
   * DELETE /sipoc/:sipocId/versions/:versionId
   */
  @Delete(':versionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVersion(@Param('versionId') versionId: string) {
    await this.versionService.deleteVersion(versionId);
  }
}
