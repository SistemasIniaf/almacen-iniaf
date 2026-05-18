import { useUnidadesActive } from "@/modules/unidades/hooks/useUnidades"

/**
 * Devuelve las unidades activas formateadas para usar en selects.
 * Usa el endpoint /unidades/all (sin paginar).
 */
export function useUnidadesOptions() {
  const { data: unidades, isLoading } = useUnidadesActive()

  const options =
    unidades?.map((u) => ({
      value: String(u.id),
      label: `${u.sigla} — ${u.nombre}`,
    })) ?? []

  return { options, isLoading }
}
