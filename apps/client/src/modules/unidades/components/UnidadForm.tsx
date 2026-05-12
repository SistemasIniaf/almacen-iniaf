"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form/FormInput"
import { FieldGroup } from "@/components/ui/field"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { unidadSchema } from "../lib/unidad.schema"

import type { UnidadFormInput, UnidadFormOutput } from "../lib/unidad.schema"

interface UnidadFormProps {
  onClose?: () => void
}

export function UnidadForm({ onClose }: UnidadFormProps) {
  const { control, handleSubmit, reset } = useForm<UnidadFormInput>({
    resolver: zodResolver(unidadSchema),
    defaultValues: {
      nombre: "",
      ubicacion: "",
      activo: true,
    },
  })

  function onSubmit(data: UnidadFormInput) {
    const validated: UnidadFormOutput = unidadSchema.parse(data)
    console.log(validated)

    reset()
    onClose?.()
  }

  function handleCancel() {
    reset()
    onClose?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormInput name="nombre" label="Nombre" control={control} />
        <FormInput
          name="ubicacion"
          label="Ubicación"
          control={control}
          required={false}
        />
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit">Registrar</Button>
      </DialogFooter>
    </form>
  )
}
