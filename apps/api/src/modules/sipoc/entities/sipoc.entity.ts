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
  status: string;
  createdAt: Date;
  updatedAt: Date;
  is_template: boolean;
  createdBy: string;
  processId?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface SipocConnection {
  connection_id: string;
  documentId: string;
  source_element_id: string;
  target_element_id: string;
  description?: string;
  status: string;
  sipoc_id: string;
  source_sipoc_id: string;
  target_sipoc_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SipocTag {
  sipoc_id: string;
  tag_id: number;
  documentId: string;
}

export interface SipocHistory {
  history_id: number;
  documentId: string;
  sipoc_id: string;
  changed_by: string;
  changed_at: Date;
  change_description?: string;
  change_type?: string;
}

export interface SipocPermission {
  permission_id: number;
  documentId: string;
  sipoc_id: string;
  user_id: string;
  permission_level: string;
  granted_at: Date;
  granted_by: string;
}

export interface SipocComment {
  comment_id: number;
  documentId: string;
  sipoc_id: string;
  user_id: string;
  comment_text: string;
  created_at: Date;
  parent_comment_id?: number;
}
