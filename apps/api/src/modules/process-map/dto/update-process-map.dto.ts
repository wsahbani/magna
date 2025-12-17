import { PartialType } from '@nestjs/swagger';
import { CreateProcessMapDto } from './create-process-map.dto';

export class UpdateProcessMapDto extends PartialType(CreateProcessMapDto) {}

