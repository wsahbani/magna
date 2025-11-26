import { IsOptional, IsEnum, IsUUID, IsInt, IsString } from 'class-validator';
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
  @IsInt()
  level?: number;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;

  @IsOptional()
  @IsString()
  createdById?: string;
}