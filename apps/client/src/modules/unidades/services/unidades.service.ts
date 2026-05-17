import { api } from "@/lib/axios"

import type { Unidad, UnidadDetalle } from "../types/unidad.types"
import type { UnidadFormOutput } from "../lib/unidad.schema"

export const unidadesService = {
  findAll: async (soloActivos?: boolean): Promise<Unidad[]> => {
    const { data } = await api.get<Unidad[]>("/unidades", {
      params: soloActivos ? { soloActivos: "true" } : undefined,
    })
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
