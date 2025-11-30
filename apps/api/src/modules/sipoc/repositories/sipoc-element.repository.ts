import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SipocElement, ElementType } from '../entities/sipoc.entity';

@Injectable()
export class SipocElementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBySipocId(sipoc_id: string): Promise<any> {
    return this.prisma.sipocElement.findMany({
      where: { sipoc_id },
      orderBy: { position: 'asc' },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.sipocElement.findUnique({
      where: { id },
    });
  }

  async create(data: {
    type: ElementType;
    title: string;
    description: string;
    position: number;
    globalOrder?: number;
    flow_id?: string;
    contactInfo?: string;
    qualityCriteria?: string;
    responsibleRole?: string;
    duration?: string;
    sipoc_id: string;
  }):  Promise<any> {
    return this.prisma.sipocElement.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      type?: ElementType;
      title?: string;
      description?: string;
      position?: number;
      globalOrder?: number;
      flow_id?: string;
      contactInfo?: string;
      qualityCriteria?: string;
      responsibleRole?: string;
      duration?: string;
    },
  ): Promise<any> {
    return this.prisma.sipocElement.update({
      where: { id },
      data,
    });
  }

  async delete(id: string):  Promise<any> {
    return this.prisma.sipocElement.delete({
      where: { id },
    });
  }

  async updateMany(
    updates: Array<{ id: string; position: number }>,
  ): Promise<void> {
    await this.prisma.$transaction(
      updates.map((update) =>
        this.prisma.sipocElement.update({
          where: { id: update.id },
          data: { position: update.position },
        }),
      ),
    );
  }

  async findByType(
    sipoc_id: string,
    type: ElementType,
  ): Promise<any> {
    return this.prisma.sipocElement.findMany({
      where: { sipoc_id, type },
      orderBy: { position: 'asc' },
    });
  }

  /**
   * Find all elements except those from a specific version
   * Used for similarity search across different versions
   */
  async findAllExcept(sipoc_id: string): Promise<any> {
    return this.prisma.sipocElement.findMany({
      where: {
        sipoc_id: {
          not: sipoc_id,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        sipoc_id: true,
      },
    });
  }
}
