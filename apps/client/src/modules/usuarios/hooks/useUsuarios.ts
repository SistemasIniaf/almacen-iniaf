import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usuariosService } from "../services/usuarios.service"

import type {
  CreateUsuarioFormOutput,
  UpdateUsuarioFormOutput,
} from "../lib/usuario.schema"
import type { PaginationParams } from "@/common/types/pagination.types"

export const USUARIOS_KEY = ["usuarios"] as const

// ── Queries ───────────────────────────────────────────────────────────────────

export function useUsuarios(
  pagination: PaginationParams,
  soloActivos?: boolean
) {
  return useQuery({
    queryKey: [...USUARIOS_KEY, pagination, { soloActivos }],
    queryFn: () => usuariosService.findAll(pagination, soloActivos),
  })
}

export function useUsuario(id: number) {
  return useQuery({
    queryKey: [...USUARIOS_KEY, id],
    queryFn: () => usuariosService.findOne(id),
    enabled: !!id,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateUsuario(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUsuarioFormOutput) =>
      usuariosService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USUARIOS_KEY })
      options?.onSuccess?.()
    },
  })
}

export function useUpdateUsuario(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<UpdateUsuarioFormOutput>
    }) => usuariosService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USUARIOS_KEY })
      options?.onSuccess?.()
    },
  })
}

export function useToggleUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usuariosService.toggle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USUARIOS_KEY })
    },
  })
}

export function useDeleteUsuario(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usuariosService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USUARIOS_KEY })
      options?.onSuccess?.()
    },
  })
}
