import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceRepository, PrismaService],
  exports: [WorkspaceService, WorkspaceRepository],
})
export class WorkspaceModule {}
