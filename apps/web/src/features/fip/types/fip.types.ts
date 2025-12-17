export interface ProcessIdentityCard {
  fip_id: string;
  documentId: string;
  processId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  objectives?: string;
  scope?: string;
  indicators?: FipIndicator[];
  stakeholders?: FipStakeholder[];
  risks?: FipRisk[];
  opportunities?: FipOpportunity[];
  resources?: FipResource[];
  performanceTargets?: FipPerformanceTarget[];
  process?: {
    id: string;
    name: string;
    description?: string;
    level: number;
    type: string;
    status: string;
  };
}

export interface FipIndicator {
  name: string;
  description?: string;
  unit?: string;
  targetValue?: number;
  currentValue?: number;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  responsible?: string;
}

export interface FipStakeholder {
  name: string;
  role: string;
  responsibility?: string;
  contact?: string;
}

export interface FipRisk {
  description: string;
  probability?: 'low' | 'medium' | 'high';
  impact?: 'low' | 'medium' | 'high';
  mitigation?: string;
}

export interface FipOpportunity {
  description: string;
  potential?: string;
  actionPlan?: string;
}

export interface FipResource {
  type: 'human' | 'material' | 'financial' | 'technical';
  description: string;
  quantity?: string;
  cost?: number;
}

export interface FipPerformanceTarget {
  indicator: string;
  target: number;
  deadline?: string;
  responsible?: string;
}

export interface CreateFipDto {
  processId: string;
  status?: string;
  objectives?: string;
  scope?: string;
  indicators?: FipIndicator[];
  stakeholders?: FipStakeholder[];
  risks?: FipRisk[];
  opportunities?: FipOpportunity[];
  resources?: FipResource[];
  performanceTargets?: FipPerformanceTarget[];
}

export interface UpdateFipDto {
  status?: string;
  objectives?: string;
  scope?: string;
  indicators?: FipIndicator[];
  stakeholders?: FipStakeholder[];
  risks?: FipRisk[];
  opportunities?: FipOpportunity[];
  resources?: FipResource[];
  performanceTargets?: FipPerformanceTarget[];
}

