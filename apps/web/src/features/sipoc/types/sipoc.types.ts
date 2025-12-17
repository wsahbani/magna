export enum ElementType {
  supplier = 'supplier',
  input = 'input',
  process = 'process',
  output = 'output',
  customer = 'customer',
}

export interface SipocDiagram {
  sipoc_id: string;
  documentId: string;
  title: string;
  description?: string;
  process_owner?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: string;
  is_template: boolean;
  createdBy: string;
  processId?: string;
  sipocElements?: SipocElement[];
  tags?: SipocTag[];
}

export interface SipocElement {
  id: string;
  documentId: string;
  type: ElementType;
  title: string;
  description: string;
  position: number;
  globalOrder?: number;
  flow_id?: string;
  contactInfo?: string;
  qualityCriteria?: string;
  responsibleRole?: string;
  duration?: string;
  sipoc_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SipocConnection {
  connection_id: string;
  documentId: string;
  source_element_id: string;
  target_element_id: string;
  description?: string;
  status: string;
  source_sipoc_id: string;
  target_sipoc_id: string;
}

export interface SipocTag {
  sipoc_id: string;
  tag_id: number;
  documentId: string;
  tag?: {
    tag_id: number;
    name: string;
    color?: string;
  };
}

export interface CreateSipocDto {
  title: string;
  description?: string;
  process_owner?: string;
  department?: string;
  version?: number;
  status?: string;
  is_template?: boolean;
  processId?: string;
}

export interface UpdateSipocDto {
  title?: string;
  description?: string;
  process_owner?: string;
  department?: string;
  version?: number;
  status?: string;
  is_template?: boolean;
  processId?: string;
}

export interface CreateElementDto {
  type: ElementType;
  title: string;
  description: string;
  position: number;
  globalOrder?: number;
  flow_id?: string;
  contactInfo?: string;
  qualityCriteria?: string;
  responsibleRole?: string;
  duration?: string;
  sipoc_id: string;
}

export interface UpdateElementDto {
  type?: ElementType;
  title?: string;
  description?: string;
  position?: number;
  globalOrder?: number;
  flow_id?: string;
  contactInfo?: string;
  qualityCriteria?: string;
  responsibleRole?: string;
  duration?: string;
}

export interface ReorderElementsDto {
  elements: Array<{ id: string; position: number }>;
}

export interface CreateConnectionDto {
  source_element_id: string;
  target_element_id: string;
  description?: string;
  status?: string;
  source_sipoc_id: string;
  target_sipoc_id: string;
}

export interface SimilarElement {
  element: SipocElement;
  sipoc: {
    sipoc_id: string;
    title: string;
  };
  similarityScore: number;
  matchType: 'exact' | 'contains' | 'partial' | 'word_match';
}

// ====================================
// VERSIONING
// ====================================

export enum SipocStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface SipocHistory {
  history_id: number;
  documentId: string;
  sipoc_id: string;
  changed_by: string;
  changed_at: string;
  change_description?: string;
  change_type?: string;
  previous_state?: Record<string, unknown>;
  new_state?: Record<string, unknown>;
}

