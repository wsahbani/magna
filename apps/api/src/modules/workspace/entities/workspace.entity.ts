import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkspaceEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => WorkspaceEntity })
  parent?: WorkspaceEntity;

  @ApiPropertyOptional({ type: () => [WorkspaceEntity] })
  children?: WorkspaceEntity[];

  @ApiPropertyOptional()
  _count?: {
    departments?: number;
    processes?: number;
    workspaceMembers?: number;
  };
}
