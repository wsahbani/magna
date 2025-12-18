import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectValidationDto {
  @ApiProperty({
    description: 'Comment explaining why the validation is rejected',
    example: 'Missing required documentation',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Comment is required for rejection' })
  comment: string;
}

