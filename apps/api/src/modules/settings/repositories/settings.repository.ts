import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Setting } from '../entities/setting.entity';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string): Promise<Setting[]> {
    return this.prisma.setting.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    }) as Promise<Setting[]>;
  }

  async findByKey(key: string): Promise<Setting | null> {
    return this.prisma.setting.findUnique({
      where: { key },
    }) as Promise<Setting | null>;
  }

  async findPublicSettings(): Promise<Setting[]> {
    return this.prisma.setting.findMany({
      where: { isPublic: true },
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    }) as Promise<Setting[]>;
  }

  async create(data: CreateSettingDto): Promise<Setting> {
    return this.prisma.setting.create({
      data,
    }) as Promise<Setting>;
  }

  async update(key: string, data: UpdateSettingDto): Promise<Setting> {
    return this.prisma.setting.update({
      where: { key },
      data,
    }) as Promise<Setting>;
  }

  async delete(key: string): Promise<void> {
    await this.prisma.setting.delete({
      where: { key },
    });
  }

  async getCategories(): Promise<string[]> {
    const settings = await this.prisma.setting.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return settings.map((s) => s.category);
  }
}
