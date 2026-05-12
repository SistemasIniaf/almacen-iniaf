import { z } from "zod"

export const rolEnum = ["admin", "encargado", "operador"] as const

export type Rol = (typeof rolEnum)[number]

export const usuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  usuario: z
    .string()
    .min(1, "El usuario es requerido")
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(50, "El usuario no puede superar los 50 caracteres")
    .regex(/^[a-zA-Z0-9_.]+$/, "Solo letras, números, punto y guión bajo"),

  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede superar los 100 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),

  rol: z.enum(rolEnum, {
    error: () => ({ message: "Selecciona un rol válido" }),
  }),

  estado: z.boolean().default(true),
})

export type UsuarioFormInput = z.input<typeof usuarioSchema>
export type UsuarioFormOutput = z.infer<typeof usuarioSchema>
