import type { Rol } from "@/store/auth.store"

export interface Usuario {
  id: number
  nombre: string
  usuario: string
  rol: Rol
  activo: boolean
  unidadId: number | null
  createdAt: string
  updatedAt: string
  unidad: {
    id: number
    nombre: string
    sigla: string
  } | null
}
