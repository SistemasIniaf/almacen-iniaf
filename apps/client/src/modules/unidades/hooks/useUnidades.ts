import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { unidadesService } from "../services/unidades.service"
import type { UnidadFormOutput } from "../lib/unidad.schema"
import type { PaginationParams } from "@/common/types/pagination.types"

export const UNIDADES_KEY = ["unidades"] as const

// ── Queries ───────────────────────────────────────────────────────────────────

export function useUnidades(
  pagination: PaginationParams,
  soloActivos?: boolean
) {
  return useQuery({
    queryKey: [...UNIDADES_KEY, pagination, { soloActivos }],
    queryFn: () => unidadesService.findAll(pagination, soloActivos),
  })
}

export function useUnidadesActive() {
  return useQuery({
    queryKey: [...UNIDADES_KEY, "active"],
    queryFn: () => unidadesService.findAllActive(),
    staleTime: 1000 * 60 * 5, // 5 min — cambian poco
  })
}

export function useUnidad(id: number) {
  return useQuery({
    queryKey: [...UNIDADES_KEY, id],
    queryFn: () => unidadesService.findOne(id),
    enabled: !!id,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateUnidad(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UnidadFormOutput) => unidadesService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: UNIDADES_KEY })
      options?.onSuccess?.()
    },
  })
}

export function useUpdateUnidad(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Partial<UnidadFormOutput>
    }) => unidadesService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: UNIDADES_KEY })
      options?.onSuccess?.()
    },
  })
}

export function useToggleUnidad() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => unidadesService.toggle(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: UNIDADES_KEY })
    },
  })
}

export function useDeleteUnidad(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => unidadesService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: UNIDADES_KEY })
      options?.onSuccess?.()
    },
  })
}
