export interface ProcessIdentityCard {
  fip_id: string;
  documentId: string;
  processId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  objectives?: string;
  scope?: string;
  indicators?: any;
  stakeholders?: any;
  risks?: any;
  opportunities?: any;
  resources?: any;
  performanceTargets?: any;
}

export interface FipIndicator {
  name: string;
  description?: string;
  unit?: string;
  targetValue?: number;
  currentValue?: number;
  frequency?: string; // daily, weekly, monthly, quarterly, yearly
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
  probability?: string; // low, medium, high
  impact?: string; // low, medium, high
  mitigation?: string;
}

export interface FipOpportunity {
  description: string;
  potential?: string;
  actionPlan?: string;
}

export interface FipResource {
  type: string; // human, material, financial, technical
  description: string;
  quantity?: string;
  cost?: number;
}

export interface FipPerformanceTarget {
  indicator: string;
  target: number;
  deadline?: Date;
  responsible?: string;
}

