import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@orange.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'Password123!' })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Group ID (RH, Commercial, Qualité, etc.)' })
  @IsOptional()
  groupId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false, description: 'Admin flag - only admins can manage users and groups' })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    @IsOptional()
    emailVerified?: boolean;
}
