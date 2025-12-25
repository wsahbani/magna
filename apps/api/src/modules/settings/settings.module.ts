import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './services/settings.service';
import { EncryptionService } from './services/encryption.service';
import { SettingsRepository } from './repositories/settings.repository';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [SettingsController],
  providers: [SettingsService, EncryptionService, SettingsRepository],
  exports: [SettingsService, EncryptionService],
})
export class SettingsModule {}
