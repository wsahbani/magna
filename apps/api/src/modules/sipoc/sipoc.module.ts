import { Module } from '@nestjs/common';
import { SipocController } from './controllers/sipoc.controller';
import { SipocElementsController } from './controllers/sipoc-elements.controller';
import { SipocConnectionsController } from './controllers/sipoc-connections.controller';
import { SipocConnectionController } from './controllers/sipoc-connection.controller';
import { SipocVersionController } from './controllers/sipoc-version.controller';
import { SipocService } from './services/sipoc.service';
import { SipocConnectionService } from './services/sipoc-connection.service';
import { SipocVersionService } from './services/sipoc-version.service';
import { SipocDiagramRepository } from './repositories/sipoc-diagram.repository';
import { SipocElementRepository } from './repositories/sipoc-element.repository';
import { SipocConnectionRepository } from './repositories/sipoc-connection.repository';


@Module({
  imports: [],
  controllers: [
    SipocController,
    SipocElementsController,
    SipocConnectionsController,
    SipocConnectionController,
    SipocVersionController,
  ],
  providers: [
    SipocService,
    SipocConnectionService,
    SipocVersionService,
    SipocDiagramRepository,
    SipocElementRepository,
    SipocConnectionRepository,
  ],
  exports: [SipocService, SipocConnectionService],
})
export class SipocModule {}
