import { Module } from '@nestjs/common';
import { FipController } from './controllers/fip.controller';
import { FipService } from './services/fip.service';
import { FipRepository } from './repositories/fip.repository';

@Module({
  imports: [],
  controllers: [FipController],
  providers: [FipService, FipRepository],
  exports: [FipService],
})
export class FipModule {}

