/**
 * Types for Qualigram Flow Editor
 */

export type QualigramLevel = 'macro-process' | 'process' | 'procedure'

export interface QualigramEditorState {
  selectedMacroProcessId?: string
  selectedProcessId?: string
  selectedProcedureId?: string
  currentLevel: QualigramLevel
}

export interface QualigramHierarchyItem {
  id: string
  name: string
  type: QualigramLevel
  children?: QualigramHierarchyItem[]
  count?: number
  status?: string
}

