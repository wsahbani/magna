/**
 * Frontend Enums
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

