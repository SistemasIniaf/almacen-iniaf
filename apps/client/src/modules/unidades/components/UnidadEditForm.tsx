import { isAxiosError } from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { FormInput } from "@/components/form/FormInput"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"

import { unidadSchema } from "../lib/unidad.schema"
import { useUpdateUnidad } from "../hooks/useUnidades"

import type { Unidad } from "../types/unidad.types"
import type { UnidadFormInput } from "../lib/unidad.schema"

interface UnidadEditFormProps {
  unidad: Unidad
  onClose?: () => void
}

export function UnidadEditForm({ unidad, onClose }: UnidadEditFormProps) {
  const { control, handleSubmit, setError } = useForm<UnidadFormInput>({
    resolver: zodResolver(unidadSchema),
    defaultValues: {
      nombre: unidad.nombre,
      sigla: unidad.sigla,
      activo: unidad.activo,
    },
  })

  const { mutate: updateUnidad, isPending } = useUpdateUnidad({
    onSuccess: () => onClose?.(),
  })

  function onSubmit(data: UnidadFormInput) {
    updateUnidad(
      { id: unidad.id, payload: data },
      {
        onError: (error) => {
          if (isAxiosError(error)) {
            const message =
              (error.response?.data as { message?: string })?.message ??
              "Error al actualizar la unidad"

            if (message.toLowerCase().includes("sigla")) {
              setError("sigla", { message })
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
          label="Nombre"
          control={control}
          disabled={isPending}
        />
        <FormInput
          name="sigla"
          label="Sigla"
          control={control}
          disabled={isPending}
        />
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
