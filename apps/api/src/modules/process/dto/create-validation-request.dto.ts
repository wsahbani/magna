import { IsArray, IsString, IsUUID, ArrayMinSize, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateValidationRequestDto {
  @ApiProperty({
    description: 'Array of user IDs who should validate the process',
    example: ['user-id-1', 'user-id-2'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one validator is required' })
  validatorIds: string[];


  @ApiProperty({
    description: 'Comment for the validation request',
    example: 'Please review the process diagram',
    type: String,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}

