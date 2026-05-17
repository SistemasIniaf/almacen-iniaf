import { z } from "zod"

export const unidadSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  sigla: z.string().min(2).max(10),
  activo: z.boolean().default(true),
})

export type UnidadFormInput = z.input<typeof unidadSchema>
export type UnidadFormOutput = z.infer<typeof unidadSchema>
