import { z } from "zod"

export const rolEnum = [
  "administrador",
  "responsable_almacen",
  "solicitador",
  "aprobador",
  "auditor",
] as const

export type Rol = (typeof rolEnum)[number]

export const rolLabels: Record<Rol, string> = {
  administrador: "Administrador",
  responsable_almacen: "Responsable de Almacén",
  solicitador: "Solicitador",
  aprobador: "Aprobador",
  auditor: "Auditor",
}

// ── Crear ─────────────────────────────────────────────────────────────────────

export const createUsuarioSchema = z
  .object({
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
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(100, "La contraseña no puede superar los 100 caracteres"),

    rol: z.enum(rolEnum, {
      error: () => ({ message: "Selecciona un rol válido" }),
    }),

    unidadId: z
      .number({ error: () => ({ message: "Selecciona una unidad" }) })
      .nullable(),

    activo: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.rol !== "administrador" && !data.unidadId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Este rol requiere una unidad asignada",
        path: ["unidadId"],
      })
    }
    if (data.rol === "administrador" && data.unidadId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El administrador no puede tener unidad",
        path: ["unidadId"],
      })
    }
  })

// ── Editar ────────────────────────────────────────────────────────────────────

export const updateUsuarioSchema = z
  .object({
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
      .max(100)
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .optional()
      .or(z.literal("")),

    rol: z.enum(rolEnum, {
      error: () => ({ message: "Selecciona un rol válido" }),
    }),

    unidadId: z.number().nullable().optional(),

    activo: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.rol !== "administrador" && !data.unidadId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Este rol requiere una unidad asignada",
        path: ["unidadId"],
      })
    }
    if (data.rol === "administrador" && data.unidadId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El administrador no puede tener unidad",
        path: ["unidadId"],
      })
    }
  })

export type CreateUsuarioFormInput = z.input<typeof createUsuarioSchema>
export type CreateUsuarioFormOutput = z.infer<typeof createUsuarioSchema>

export type UpdateUsuarioFormInput = z.input<typeof updateUsuarioSchema>
export type UpdateUsuarioFormOutput = z.infer<typeof updateUsuarioSchema>
