import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ElementOrder {
  id: string;
  position: number;
}

export class ReorderElementsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ElementOrder)
  elements: ElementOrder[];
}
