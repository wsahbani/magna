/**
 * Frontend Enums for Process (Level 2)
 * Types matching Prisma enums but defined in frontend
 * DO NOT import from @prisma/client in frontend code
 */

/**
 * Process Status Enum
 * Matches ProcessStatus from Prisma schema
 */
export enum ProcessStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  VALIDATED = 'VALIDATED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  OBSOLETE = 'OBSOLETE',
}

/**
 * Process Type Enum
 * Matches ProcessType from Prisma schema
 */
export enum ProcessType {
  FLOW = 'FLOW',
  SIPOC = 'SIPOC',
}

/**
 * Process Priority Enum
 * Matches ProcessPriority from Prisma schema
 */
export enum ProcessPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Confidentiality Level Enum
 * Matches ConfidentialityLevel from Prisma schema
 */
export enum ConfidentialityLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED',
  CONFIDENTIAL = 'CONFIDENTIAL',
}

/**
 * Flow Node Type Enum
 * Matches FlowNodeType from Prisma schema
 */
export enum FlowNodeType {
  PROCESS = 'PROCESS',
  PROCEDURE = 'PROCEDURE',
  STEP = 'STEP',
  START = 'START',
  END = 'END',
  DECISION = 'DECISION',
  ACTION = 'ACTION',
  SUBFLOW = 'SUBFLOW',
}

