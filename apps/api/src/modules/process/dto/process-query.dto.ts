import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { ProcessType, ProcessStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ProcessQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(ProcessType)
  type?: ProcessType;

  @IsOptional()
  @IsEnum(ProcessStatus)
  status?: ProcessStatus;

  @IsOptional()
  @IsString()
  @IsUUID()
  processMapId?: string; // Filter by ProcessMap

  @IsOptional()
  @IsString()
  @IsUUID()
  workspaceId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  createdById?: string;

  @IsOptional()
  @IsString()
  search?: string; // Search in title, description, code
}