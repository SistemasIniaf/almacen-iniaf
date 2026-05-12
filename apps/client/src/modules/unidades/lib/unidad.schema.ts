import { z } from "zod"

export const unidadSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  ubicacion: z
    .string()
    .max(150, "La ubicación no puede superar los 150 caracteres")
    .optional(),

  activo: z.boolean().default(true),
})

export type UnidadFormInput = z.input<typeof unidadSchema>
export type UnidadFormOutput = z.infer<typeof unidadSchema>
