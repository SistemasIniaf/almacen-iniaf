export interface Unidad {
  id: number
  nombre: string
  sigla: string
  activo: boolean
  _count: {
    usuarios: number
  }
}

export interface UnidadDetalle extends Omit<Unidad, "_count"> {
  usuarios: {
    id: number
    nombre: string
    usuario: string
    rol: string
    activo: boolean
  }[]
}
