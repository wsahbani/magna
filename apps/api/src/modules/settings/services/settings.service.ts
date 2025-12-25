import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository';
import { EncryptionService } from './encryption.service';
import { Setting } from '../entities/setting.entity';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    private readonly repository: SettingsRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Get all settings, optionally filtered by category
   */
  async findAll(category?: string, isAdmin = false): Promise<Setting[]> {
    const settings = await this.repository.findAll(category);

    // Non-admin users only see public settings
    if (!isAdmin) {
      return settings.filter((s) => s.isPublic);
    }

    return settings;
  }

  /**
   * Get a specific setting by key
   */
  async findOne(key: string, isAdmin = false): Promise<Setting> {
    const setting = await this.repository.findByKey(key);

    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    // Check permission
    if (!setting.isPublic && !isAdmin) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }

    return setting;
  }

  /**
   * Get decrypted value for a setting
   */
  async getDecryptedValue(key: string): Promise<string | null> {
    const setting = await this.findOne(key, true);

    if (!setting.value) {
      return null;
    }

    if (setting.isEncrypted) {
      try {
        return this.encryptionService.decrypt(setting.value);
      } catch (error) {
        this.logger.error(`Failed to decrypt setting "${key}": ${error.message}`);
        throw new BadRequestException('Failed to decrypt setting value');
      }
    }

    return setting.value;
  }

  /**
   * Create a new setting
   */
  async create(dto: CreateSettingDto): Promise<Setting> {
    // Check if key already exists
    const existing = await this.repository.findByKey(dto.key);
    if (existing) {
      throw new BadRequestException(`Setting with key "${dto.key}" already exists`);
    }

    // Encrypt value if needed
    if (dto.isEncrypted && dto.value) {
      dto.value = this.encryptionService.encrypt(dto.value);
    }

    const setting = await this.repository.create(dto);
    this.logger.log(`Setting created: ${setting.key}`);

    return setting;
  }

  /**
   * Update a setting
   */
  async update(key: string, dto: UpdateSettingDto): Promise<Setting> {
    const existing = await this.findOne(key, true);

    // Encrypt value if the setting requires encryption
    if (existing.isEncrypted && dto.value) {
      dto.value = this.encryptionService.encrypt(dto.value);
    }

    const setting = await this.repository.update(key, dto);
    this.logger.log(`Setting updated: ${key}`);

    return setting;
  }

  /**
   * Delete a setting
   */
  async delete(key: string): Promise<void> {
    await this.findOne(key, true); // Check if exists
    await this.repository.delete(key);
    this.logger.log(`Setting deleted: ${key}`);
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    return this.repository.getCategories();
  }

  /**
   * Get settings by category
   */
  async findByCategory(category: string, isAdmin = false): Promise<Setting[]> {
    return this.findAll(category, isAdmin);
  }
}
