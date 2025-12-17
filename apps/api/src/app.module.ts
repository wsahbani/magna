import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { ProcessModule } from './modules/process/process.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { SipocModule } from './modules/sipoc/sipoc.module';
import { FipModule } from './modules/fip/fip.module';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ProcedureModule } from './modules/procedure/procedure.module';
import { ProcessMapModule } from './modules/process-map/process-map.module';
import { PrismaModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './modules/ai/ai.module';
import { DatabaseModule } from './modules/database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProcessMapModule,
    ProcessModule,
    ProcedureModule,
    WorkspaceModule,
    SipocModule,
    FipModule,
    UsersModule,
    GroupsModule,
    AIModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}