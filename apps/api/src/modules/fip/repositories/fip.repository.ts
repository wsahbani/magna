import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ProcessIdentityCard } from '../entities/fip.entity';

@Injectable()
export class FipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(fip_id: string): Promise<ProcessIdentityCard | null> {
    const result = await this.prisma.processIdentityCard.findUnique({
      where: { fip_id },
      include: {
        process: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            type: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return result as ProcessIdentityCard | null;
  }

  async findByProcessId(processId: string): Promise<ProcessIdentityCard | null> {
    const result = await this.prisma.processIdentityCard.findUnique({
      where: { processId },
      include: {
        process: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            type: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return result as ProcessIdentityCard | null;
  }

  async create(
    data: {
      processId: string;
      status?: string;
      objectives?: string;
      scope?: string;
      indicators?: any;
      stakeholders?: any;
      risks?: any;
      opportunities?: any;
      resources?: any;
      performanceTargets?: any;
      createdBy: string;
    },
  ): Promise<ProcessIdentityCard> {
    return this.prisma.processIdentityCard.create({
      data: {
        processId: data.processId,
        status: data.status || 'draft',
        objectives: data.objectives,
        scope: data.scope,
        indicators: data.indicators,
        stakeholders: data.stakeholders,
        risks: data.risks,
        opportunities: data.opportunities,
        resources: data.resources,
        performanceTargets: data.performanceTargets,
        createdBy: data.createdBy,
      },
    });
  }

  async update(
    fip_id: string,
    data: {
      status?: string;
      objectives?: string;
      scope?: string;
      indicators?: any;
      stakeholders?: any;
      risks?: any;
      opportunities?: any;
      resources?: any;
      performanceTargets?: any;
    },
  ): Promise<ProcessIdentityCard> {
    return this.prisma.processIdentityCard.update({
      where: { fip_id },
      data,
    });
  }

  async delete(fip_id: string): Promise<ProcessIdentityCard> {
    return this.prisma.processIdentityCard.delete({
      where: { fip_id },
    });
  }
}

