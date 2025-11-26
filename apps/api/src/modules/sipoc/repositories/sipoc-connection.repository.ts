import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SipocConnection } from '../entities/sipoc.entity';

@Injectable()
export class SipocConnectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByVersionId(versionId: string): Promise<SipocConnection[]> {
    return this.prisma.sipocConnection.findMany({
      where: {
        versionId,
      },
      include: {
        sourceElement: true,
        targetElement: true,
      },
    });
  }

  async findByElementId(element_id: string): Promise<SipocConnection[]> {
    return this.prisma.sipocConnection.findMany({
      where: {
        OR: [
          { source_element_id: element_id },
          { target_element_id: element_id },
        ],
      },
      include: {
        sourceElement: true,
        targetElement: true,
      },
    });
  }

  async findById(connection_id: string): Promise<SipocConnection | null> {
    return this.prisma.sipocConnection.findUnique({
      where: { connection_id },
      include: {
        sourceElement: true,
        targetElement: true,
      },
    });
  }

  async create(data: {
    source_element_id: string;
    target_element_id: string;
    description?: string;
    status?: string;
    versionId: string;
  }): Promise<SipocConnection> {
    return this.prisma.sipocConnection.create({
      data: {
        ...data,
        status: data.status || 'active',
      },
    });
  }

  async delete(connection_id: string): Promise<SipocConnection> {
    return this.prisma.sipocConnection.delete({
      where: { connection_id },
    });
  }

  async deleteByElementId(element_id: string): Promise<number> {
    const result = await this.prisma.sipocConnection.deleteMany({
      where: {
        OR: [
          { source_element_id: element_id },
          { target_element_id: element_id },
        ],
      },
    });
    return result.count;
  }
}
