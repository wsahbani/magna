import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveValidationDto {
  @ApiPropertyOptional({
    description: 'Optional comment for the approval',
    example: 'Process looks good, approved',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}

