import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcessStatus, ProcessType, ProcessPriority, ConfidentialityLevel } from '@prisma/client';

class ProcedureSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  status: string;
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

class ProcessMapSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  code: string;
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

class ProcessCount {
  @ApiPropertyOptional()
  procedures?: number;

  @ApiPropertyOptional()
  actors?: number;

  @ApiPropertyOptional()
  processIOs?: number;

  @ApiPropertyOptional()
  comments?: number;

  @ApiPropertyOptional()
  documents?: number;

  @ApiPropertyOptional()
  tags?: number;
}

export class ProcessEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ProcessType })
  type: ProcessType;

  @ApiProperty({ enum: ProcessStatus })
  status: ProcessStatus;

  @ApiProperty()
  processMapId: string;

  @ApiProperty()
  workspaceId: string;

  @ApiPropertyOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  objectif?: string;

  @ApiPropertyOptional()
  perimetre?: string;

  @ApiPropertyOptional()
  finalite?: string;

  @ApiPropertyOptional({ enum: ProcessPriority })
  priority?: ProcessPriority;

  @ApiPropertyOptional({ enum: ConfidentialityLevel })
  confidentiality?: ConfidentialityLevel;

  @ApiPropertyOptional()
  reviewFrequency?: number;

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

  @ApiPropertyOptional()
  nextReviewDate?: Date;

  @ApiPropertyOptional()
  approvalDate?: Date;

  @ApiPropertyOptional({ type: () => [ProcedureSummary] })
  procedures?: ProcedureSummary[];

  @ApiPropertyOptional({ type: () => FlowDiagramSummary })
  flowDiagram?: FlowDiagramSummary;

  @ApiPropertyOptional({ type: () => ProcessMapSummary })
  processMap?: ProcessMapSummary;

  @ApiPropertyOptional({ type: () => WorkspaceSummary })
  workspace?: WorkspaceSummary;

  @ApiPropertyOptional({ type: () => DepartmentSummary })
  department?: DepartmentSummary;

  @ApiPropertyOptional({ type: () => UserSummary })
  createdBy?: UserSummary;

  @ApiPropertyOptional({ type: () => ProcessCount })
  _count?: ProcessCount;
}
