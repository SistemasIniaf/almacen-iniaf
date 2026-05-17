import { isAxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch, Controller } from "react-hook-form"

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FormInput } from "@/components/form/FormInput"
import { FormInputPassword } from "@/components/form/FormInputPassword"

import { updateUsuarioSchema, rolEnum, rolLabels } from "../lib/usuario.schema"
import { useUpdateUsuario } from "../hooks/useUsuarios"
import { useUnidadesOptions } from "../hooks/useUnidadesOptions"

import type { Usuario } from "../types/usuario.types"
import type { UpdateUsuarioFormInput } from "../lib/usuario.schema"

interface UsuarioEditFormProps {
  usuario: Usuario
  onClose?: () => void
}

export function UsuarioEditForm({ usuario, onClose }: UsuarioEditFormProps) {
  const { options: unidadesOptions, isLoading: loadingUnidades } =
    useUnidadesOptions()

  const { control, handleSubmit, setError, setValue } =
    useForm<UpdateUsuarioFormInput>({
      resolver: zodResolver(updateUsuarioSchema),
      defaultValues: {
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        password: "",
        rol: usuario.rol,
        unidadId: usuario.unidadId ?? null,
        activo: usuario.activo,
      },
    })

  const rolActual = useWatch({ control, name: "rol" })
  const esAdmin = rolActual === "administrador"

  const { mutate: updateUsuario, isPending } = useUpdateUsuario({
    onSuccess: () => onClose?.(),
  })

  function onSubmit(data: UpdateUsuarioFormInput) {
    const parsed = updateUsuarioSchema.parse(data)

    updateUsuario(
      { id: usuario.id, payload: parsed },
      {
        onError: (error) => {
          if (isAxiosError(error)) {
            const message =
              (error.response?.data as { message?: string })?.message ??
              "Error al actualizar el usuario"

            if (message.toLowerCase().includes("usuario")) {
              setError("usuario", { message })
            } else {
              setError("root", { message })
            }
          }
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormInput
          name="nombre"
          label="Nombre completo"
          control={control}
          disabled={isPending}
        />
        <FormInput
          name="usuario"
          label="Usuario"
          control={control}
          disabled={isPending}
        />
        <FormInputPassword
          name="password"
          label="Nueva contraseña"
          control={control}
          disabled={isPending}
          required={false}
          placeholder="Dejar vacío para no cambiar"
        />

        {/* Rol */}
        <Controller
          name="rol"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel>
                Rol <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={field.value ?? ""}
                onValueChange={(val) => {
                  field.onChange(val)
                  if (val === "administrador") setValue("unidadId", null)
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolEnum.map((rol) => (
                    <SelectItem key={rol} value={rol}>
                      {rolLabels[rol]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Unidad */}
        {!esAdmin && (
          <Controller
            name="unidadId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel>
                  Unidad <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={field.value != null ? String(field.value) : ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={isPending || loadingUnidades}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue
                      placeholder={
                        loadingUnidades
                          ? "Cargando..."
                          : "Selecciona una unidad"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesOptions.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </DialogFooter>
    </form>
  )
}
