import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateSipocVersionDto } from '../dto/create-sipoc-version.dto';
import { UpdateSipocVersionDto } from '../dto/update-sipoc-version.dto';
import { PublishVersionDto } from '../dto/publish-version.dto';
import { SipocStatus } from '@prisma/client';

@Injectable()
export class SipocVersionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée une nouvelle version draft pour un diagramme SIPOC
   */
  async createVersion(sipocId: string, dto: CreateSipocVersionDto, userId: string) {
    // Vérifier que le SIPOC existe
    const sipoc = await this.prisma.sipocDiagram.findUnique({
      where: { sipoc_id: sipocId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });

    if (!sipoc) {
      throw new NotFoundException(`SIPOC ${sipocId} non trouvé`);
    }

    // Calculer le numéro de version
    const nextVersion = sipoc.versions.length > 0 ? sipoc.versions[0].version + 1 : 1;

    // Créer la nouvelle version
    const version = await this.prisma.sipocVersion.create({
      data: {
        sipoc_id: sipocId,
        version: nextVersion,
        status: SipocStatus.DRAFT,
        title: dto.title,
        description: dto.description,
        changesLog: dto.changesLog,
      },
      include: {
        elements: true,
        connections: true,
      },
    });

    // Si c'est la première version, la marquer comme draft actuelle
    if (nextVersion === 1) {
      await this.prisma.sipocDiagram.update({
        where: { sipoc_id: sipocId },
        data: { currentDraftId: version.id },
      });
    }

    return version;
  }

  /**
   * Duplique une version existante pour créer une nouvelle version draft
   */
  async duplicateVersion(sipocId: string, versionId: string, dto: CreateSipocVersionDto) {
    // Récupérer la version source avec tous ses éléments et connexions
    const sourceVersion = await this.prisma.sipocVersion.findFirst({
      where: {
        id: versionId,
        sipoc_id: sipocId,
      },
      include: {
        elements: true,
        connections: true,
      },
    });

    if (!sourceVersion) {
      throw new NotFoundException(`Version ${versionId} non trouvée`);
    }

    // Créer la nouvelle version
    const sipoc = await this.prisma.sipocDiagram.findUnique({
      where: { sipoc_id: sipocId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });

    const nextVersion = sipoc.versions[0].version + 1;

    const newVersion = await this.prisma.sipocVersion.create({
      data: {
        sipoc_id: sipocId,
        version: nextVersion,
        status: SipocStatus.DRAFT,
        title: dto.title,
        description: dto.description,
        changesLog: dto.changesLog,
      },
    });

    // Dupliquer les éléments
    const elementMapping = new Map<string, string>();

    for (const element of sourceVersion.elements) {
      const newElement = await this.prisma.sipocElement.create({
        data: {
          type: element.type,
          title: element.title,
          description: element.description,
          position: element.position,
          globalOrder: element.globalOrder,
          flow_id: element.flow_id,
          contactInfo: element.contactInfo,
          qualityCriteria: element.qualityCriteria,
          responsibleRole: element.responsibleRole,
          duration: element.duration,
          versionId: newVersion.id,
        },
      });

      elementMapping.set(element.id, newElement.id);
    }

    // Dupliquer les connexions avec les nouveaux IDs d'éléments
    for (const connection of sourceVersion.connections) {
      const newSourceId = elementMapping.get(connection.source_element_id);
      const newTargetId = elementMapping.get(connection.target_element_id);

      if (newSourceId && newTargetId) {
        await this.prisma.sipocConnection.create({
          data: {
            source_element_id: newSourceId,
            target_element_id: newTargetId,
            description: connection.description,
            status: connection.status,
            versionId: newVersion.id,
          },
        });
      }
    }

    // Mettre à jour le draft actuel
    await this.prisma.sipocDiagram.update({
      where: { sipoc_id: sipocId },
      data: { currentDraftId: newVersion.id },
    });

    return this.prisma.sipocVersion.findUnique({
      where: { id: newVersion.id },
      include: {
        elements: true,
        connections: true,
      },
    });
  }

  /**
   * Met à jour une version draft
   */
  async updateVersion(versionId: string, dto: UpdateSipocVersionDto) {
    const version = await this.prisma.sipocVersion.findUnique({
      where: { id: versionId },
    });

    if (!version) {
      throw new NotFoundException(`Version ${versionId} non trouvée`);
    }

    if (version.status !== SipocStatus.DRAFT) {
      throw new BadRequestException('Seules les versions DRAFT peuvent être modifiées');
    }

    return this.prisma.sipocVersion.update({
      where: { id: versionId },
      data: {
        title: dto.title,
        description: dto.description,
        changesLog: dto.changesLog,
      },
    });
  }

  /**
   * Publie une version draft
   */
  async publishVersion(versionId: string, dto: PublishVersionDto) {
    const version = await this.prisma.sipocVersion.findUnique({
      where: { id: versionId },
      include: { sipoc: true },
    });

    if (!version) {
      throw new NotFoundException(`Version ${versionId} non trouvée`);
    }

    if (version.status !== SipocStatus.DRAFT) {
      throw new BadRequestException('Seules les versions DRAFT peuvent être publiées');
    }

    // Utiliser une transaction pour garantir la cohérence
    return this.prisma.$transaction(async (tx) => {
      // Mettre à jour la version
      const publishedVersion = await tx.sipocVersion.update({
        where: { id: versionId },
        data: {
          status: SipocStatus.PUBLISHED,
          releasedAt: new Date(),
          changesLog: dto.changesLog || version.changesLog,
        },
      });

      // Mettre à jour le SIPOC pour pointer vers cette version publiée
      await tx.sipocDiagram.update({
        where: { sipoc_id: version.sipoc_id },
        data: {
          currentPublishedId: versionId,
          currentDraftId: null, // Retirer le draft actuel
        },
      });

      // Créer une entrée d'historique
      await tx.sipocHistory.create({
        data: {
          versionId: versionId,
          changed_by: version.sipoc.createdBy, // TODO: utiliser l'utilisateur actuel
          change_type: 'PUBLISH',
          change_description: `Version ${version.version} publiée`,
        },
      });

      return publishedVersion;
    });
  }

  /**
   * Archive une version publiée
   */
  async archiveVersion(versionId: string) {
    const version = await this.prisma.sipocVersion.findUnique({
      where: { id: versionId },
      include: { sipoc: true },
    });

    if (!version) {
      throw new NotFoundException(`Version ${versionId} non trouvée`);
    }

    if (version.status !== SipocStatus.PUBLISHED) {
      throw new BadRequestException('Seules les versions PUBLISHED peuvent être archivées');
    }

    return this.prisma.$transaction(async (tx) => {
      const archivedVersion = await tx.sipocVersion.update({
        where: { id: versionId },
        data: {
          status: SipocStatus.ARCHIVED,
        },
      });

      // Si c'était la version publiée actuelle, retirer la référence
      if (version.sipoc.currentPublishedId === versionId) {
        await tx.sipocDiagram.update({
          where: { sipoc_id: version.sipoc_id },
          data: { currentPublishedId: null },
        });
      }

      await tx.sipocHistory.create({
        data: {
          versionId: versionId,
          changed_by: version.sipoc.createdBy,
          change_type: 'ARCHIVE',
          change_description: `Version ${version.version} archivée`,
        },
      });

      return archivedVersion;
    });
  }

  /**
   * Récupère toutes les versions d'un SIPOC
   */
  async getVersions(sipocId: string) {
    return this.prisma.sipocVersion.findMany({
      where: { sipoc_id: sipocId },
      orderBy: { version: 'desc' },
      include: {
        elements: true,
        connections: true,
        history: {
          orderBy: { changed_at: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * Récupère une version spécifique
   */
  async getVersion(versionId: string) {
    const version = await this.prisma.sipocVersion.findUnique({
      where: { id: versionId },
      include: {
        elements: {
          include: {
            outgoing: true,
            incoming: true,
          },
        },
        connections: {
          include: {
            sourceElement: true,
            targetElement: true,
          },
        },
        history: {
          orderBy: { changed_at: 'desc' },
        },
      },
    });

    if (!version) {
      throw new NotFoundException(`Version ${versionId} non trouvée`);
    }

    return version;
  }

  /**
   * Supprime une version draft
   */
  async deleteVersion(versionId: string) {
    const version = await this.prisma.sipocVersion.findUnique({
      where: { id: versionId },
      include: { sipoc: true },
    });

    if (!version) {
      throw new NotFoundException(`Version ${versionId} non trouvée`);
    }

    if (version.status !== SipocStatus.DRAFT) {
      throw new BadRequestException('Seules les versions DRAFT peuvent être supprimées');
    }

    return this.prisma.$transaction(async (tx) => {
      // Si c'était le draft actuel, retirer la référence
      if (version.sipoc.currentDraftId === versionId) {
        await tx.sipocDiagram.update({
          where: { sipoc_id: version.sipoc_id },
          data: { currentDraftId: null },
        });
      }

      // Supprimer la version (cascade supprimera les éléments et connexions)
      await tx.sipocVersion.delete({
        where: { id: versionId },
      });
    });
  }
}
