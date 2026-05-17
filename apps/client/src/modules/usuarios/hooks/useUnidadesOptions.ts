import { useUnidades } from "@/modules/unidades/hooks/useUnidades"

// Devuelve las unidades activas formateadas para usar en FormSelect.
export function useUnidadesOptions() {
  const { data: unidades, isLoading } = useUnidades(true) // soloActivos=true

  const options =
    unidades?.map((u) => ({
      value: String(u.id),
      label: `${u.sigla} — ${u.nombre}`,
    })) ?? []

  return { options, isLoading }
}
