import { api } from "@/lib/axios"
import type { Unidad, UnidadDetalle } from "../types/unidad.types"
import type { UnidadFormOutput } from "../lib/unidad.schema"
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/common/types/pagination.types"

export interface UnidadOption {
  id: number
  nombre: string
  sigla: string
}

export const unidadesService = {
  findAll: async (
    pagination: PaginationParams,
    soloActivos?: boolean
  ): Promise<PaginatedResponse<Unidad>> => {
    const { data } = await api.get<PaginatedResponse<Unidad>>("/unidades", {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(soloActivos ? { soloActivos: "true" } : {}),
      },
    })
    return data
  },

  // Para selects — sin paginar, solo activas
  findAllActive: async (): Promise<UnidadOption[]> => {
    const { data } = await api.get<UnidadOption[]>("/unidades/all")
    return data
  },

  findOne: async (id: number): Promise<UnidadDetalle> => {
    const { data } = await api.get<UnidadDetalle>(`/unidades/${id}`)
    return data
  },

  create: async (payload: UnidadFormOutput): Promise<Unidad> => {
    const { data } = await api.post<Unidad>("/unidades", payload)
    return data
  },

  update: async (
    id: number,
    payload: Partial<UnidadFormOutput>
  ): Promise<Unidad> => {
    const { data } = await api.patch<Unidad>(`/unidades/${id}`, payload)
    return data
  },

  toggle: async (id: number): Promise<Unidad> => {
    const { data } = await api.patch<Unidad>(`/unidades/${id}/toggle`)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/unidades/${id}`)
  },
}
