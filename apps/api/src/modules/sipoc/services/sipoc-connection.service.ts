import { Injectable } from '@nestjs/common';
import { SipocConnectionRepository } from '../repositories/sipoc-connection.repository';
import { CreateSipocConnectionDto } from '../dto/create-sipoc-connection.dto';

@Injectable()
export class SipocConnectionService {
  constructor(
    private readonly sipocConnectionRepository: SipocConnectionRepository,
  ) {}

  async createConnection(dto: CreateSipocConnectionDto) {
    return this.sipocConnectionRepository.create({
      source_element_id: dto.sourceElementId,
      target_element_id: dto.targetElementId,
      sipoc_id: dto.sipoc_id,
      description: dto.description,
      status: 'active',
    });
  }

  async findConnectionsByElement(elementId: string) {
    return this.sipocConnectionRepository.findByElementId(elementId);
  }

  async findConnectionsByVersion(sipoc_id: string) {
    return this.sipocConnectionRepository.findBySipocId(sipoc_id);
  }

  async deleteConnection(connectionId: string) {
    return this.sipocConnectionRepository.delete(connectionId);
  }

  async findById(connectionId: string) {
    return this.sipocConnectionRepository.findById(connectionId);
  }
}
