import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ example: 'Groupe RH' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'RH' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 'Groupe des ressources humaines' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#EA580C' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
