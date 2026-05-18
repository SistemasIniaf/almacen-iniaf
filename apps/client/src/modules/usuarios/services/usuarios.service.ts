import { api } from "@/lib/axios"

import type {
  PaginatedResponse,
  PaginationParams,
} from "@/common/types/pagination.types"
import type {
  CreateUsuarioFormOutput,
  UpdateUsuarioFormOutput,
} from "../lib/usuario.schema"
import type { Usuario } from "../types/usuario.types"

export const usuariosService = {
  findAll: async (
    pagination: PaginationParams,
    soloActivos?: boolean
  ): Promise<PaginatedResponse<Usuario>> => {
    const { data } = await api.get<PaginatedResponse<Usuario>>("/usuarios", {
      params: {
        page: pagination.page,
        limit: pagination.limit,
        ...(pagination.search ? { search: pagination.search } : {}),
        ...(soloActivos ? { soloActivos: "true" } : {}),
      },
    })
    return data
  },

  findOne: async (id: number): Promise<Usuario> => {
    const { data } = await api.get<Usuario>(`/usuarios/${id}`)
    return data
  },

  create: async (payload: CreateUsuarioFormOutput): Promise<Usuario> => {
    const { data } = await api.post<Usuario>("/usuarios", payload)
    return data
  },

  update: async (
    id: number,
    payload: Partial<UpdateUsuarioFormOutput>
  ): Promise<Usuario> => {
    const body = { ...payload }
    if (!body.password) delete body.password

    const { data } = await api.patch<Usuario>(`/usuarios/${id}`, body)
    return data
  },

  toggle: async (
    id: number
  ): Promise<Pick<Usuario, "id" | "nombre" | "usuario" | "activo">> => {
    const { data } = await api.patch(`/usuarios/${id}/toggle`)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`)
  },
}
