import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessStatus } from '@prisma/client';

class ProcessSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: ProcessStatus })
  status: ProcessStatus;
}

class FlowDiagramSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  level: number;

  @ApiPropertyOptional()
  nodesCount?: number;

  @ApiPropertyOptional()
  edgesCount?: number;
}

class WorkspaceSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}

class DepartmentSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}

class UserSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

class ProcessMapCount {
  @ApiPropertyOptional()
  processes?: number;

  @ApiPropertyOptional()
  comments?: number;

  @ApiPropertyOptional()
  documents?: number;

  @ApiPropertyOptional()
  tags?: number;
}

export class ProcessMapEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ProcessStatus })
  status: ProcessStatus;

  @ApiProperty()
  workspaceId: string;

  @ApiPropertyOptional()
  departmentId?: string;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  publishedAt?: Date;

  @ApiPropertyOptional()
  archivedAt?: Date;

  @ApiPropertyOptional({ type: () => [ProcessSummary] })
  processes?: ProcessSummary[];

  @ApiPropertyOptional({ type: () => FlowDiagramSummary })
  flowDiagram?: FlowDiagramSummary;

  @ApiPropertyOptional({ type: () => WorkspaceSummary })
  workspace?: WorkspaceSummary;

  @ApiPropertyOptional({ type: () => DepartmentSummary })
  department?: DepartmentSummary;

  @ApiPropertyOptional({ type: () => UserSummary })
  createdBy?: UserSummary;

  @ApiPropertyOptional({ type: () => ProcessMapCount })
  _count?: ProcessMapCount;
}

