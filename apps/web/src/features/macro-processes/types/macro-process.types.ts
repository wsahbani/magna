export interface MacroProcess {
  id: string
  code: string
  name: string
  description?: string
  color?: string
  icon?: string
  order: number
  active: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    processes: number
  }
}

export interface MacroProcessWithRelations extends MacroProcess {
  processes?: Array<{
    id: string
    code: string
    title: string
    status: string
    createdAt: string
  }>
}

export interface CreateMacroProcessDto {
  code: string
  name: string
  description?: string
  color?: string
  icon?: string
  order?: number
  active?: boolean
}

export interface UpdateMacroProcessDto {
  name?: string
  description?: string
  color?: string
  icon?: string
  order?: number
  active?: boolean
}

export interface MacroProcessListParams {
  active?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface ReorderMacroProcessDto {
  items: Array<{
    id: string
    order: number
  }>
}

export interface PaginatedMacroProcessResponse {
  data: MacroProcess[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

