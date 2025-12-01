import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { FipRepository } from '../repositories/fip.repository';
import { CreateFipDto } from '../dto/create-fip.dto';
import { UpdateFipDto } from '../dto/update-fip.dto';
import { ProcessIdentityCard } from '../entities/fip.entity';

@Injectable()
export class FipService {
  constructor(private readonly fipRepository: FipRepository) {}

  async findById(fip_id: string): Promise<ProcessIdentityCard> {
    const fip = await this.fipRepository.findById(fip_id);
    if (!fip) {
      throw new NotFoundException(`FIP with ID ${fip_id} not found`);
    }
    return fip;
  }

  async findByProcessId(processId: string): Promise<ProcessIdentityCard | null> {
    return this.fipRepository.findByProcessId(processId);
  }

  async create(
    createFipDto: CreateFipDto,
    userId: string,
  ): Promise<ProcessIdentityCard> {
    // Check if FIP already exists for this process (one-to-one constraint)
    const existingFip = await this.fipRepository.findByProcessId(
      createFipDto.processId,
    );
    if (existingFip) {
      throw new ConflictException(
        `A FIP already exists for process ${createFipDto.processId}`,
      );
    }

    return this.fipRepository.create({
      ...createFipDto,
      createdBy: userId,
    });
  }

  async update(
    fip_id: string,
    updateFipDto: UpdateFipDto,
  ): Promise<ProcessIdentityCard> {
    await this.findById(fip_id);
    return this.fipRepository.update(fip_id, updateFipDto);
  }

  async delete(fip_id: string): Promise<void> {
    await this.findById(fip_id);
    await this.fipRepository.delete(fip_id);
  }
}

