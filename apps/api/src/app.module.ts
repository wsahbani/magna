import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { ProcessModule } from './modules/process/process.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { SipocModule } from './modules/sipoc/sipoc.module';
import { FipModule } from './modules/fip/fip.module';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,AuthModule, ProcessModule, WorkspaceModule, SipocModule, FipModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}