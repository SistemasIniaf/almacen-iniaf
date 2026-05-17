import { isAxiosError } from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { FormInput } from "@/components/form/FormInput"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"

import { unidadSchema } from "../lib/unidad.schema"
import { useCreateUnidad } from "../hooks/useUnidades"

import type { UnidadFormInput } from "../lib/unidad.schema"

interface UnidadFormProps {
  onClose?: () => void
}

export function UnidadForm({ onClose }: UnidadFormProps) {
  const { control, handleSubmit, reset, setError } = useForm<UnidadFormInput>({
    resolver: zodResolver(unidadSchema),
    defaultValues: {
      nombre: "",
      sigla: "",
      activo: true,
    },
  })

  const { mutate: createUnidad, isPending } = useCreateUnidad({
    onSuccess: () => {
      reset()
      onClose?.()
    },
  })

  function onSubmit(data: UnidadFormInput) {
    const parsed = unidadSchema.parse(data)

    createUnidad(parsed, {
      onError: (error) => {
        if (isAxiosError(error)) {
          const message =
            (error.response?.data as { message?: string })?.message ??
            "Error al crear la unidad"

          // Si es error de sigla duplicada, lo marca en el campo
          if (message.toLowerCase().includes("sigla")) {
            setError("sigla", { message })
          } else {
            setError("root", { message })
          }
        }
      },
    })
  }

  function handleCancel() {
    reset()
    onClose?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormInput
          name="nombre"
          label="Nombre"
          control={control}
          disabled={isPending}
          placeholder="Ej: Unidad de Tecnología"
        />
        <FormInput
          name="sigla"
          label="Sigla"
          control={control}
          disabled={isPending}
          placeholder="Ej: UTI"
        />
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Registrando..." : "Registrar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
