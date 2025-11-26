import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { PaginationDto, PaginatedResponse } from '../dto/pagination.dto';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly prisma: PrismaService) {}

  abstract get model(): any;

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findMany(options?: any): Promise<T[]> {
    return this.model.findMany(options);
  }

  async findWithPagination(
    pagination: PaginationDto,
    where?: any,
    include?: any,
  ): Promise<PaginatedResponse<T>> {
    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        include,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: pagination.sortBy
          ? { [pagination.sortBy]: pagination.sortOrder }
          : { createdAt: 'desc' },
      }),
      this.model.count({ where }),
    ]);

    return new PaginatedResponse(data, total, pagination.page, pagination.limit);
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({
      where: { id },
    });
    return count > 0;
  }
}