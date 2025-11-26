import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { ProcessModule } from './modules/process/process.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { SipocModule } from './modules/sipoc/sipoc.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [PrismaModule,AuthModule, ProcessModule, WorkspaceModule, SipocModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}