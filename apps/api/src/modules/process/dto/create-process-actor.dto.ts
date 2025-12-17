import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ActorType } from '@prisma/client';

export class CreateProcessActorDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @IsNotEmpty()
  @IsEnum(ActorType)
  type: ActorType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  responsibilities?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

