import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { rolEnum, usuarioSchema } from "../lib/usuario.schema"

import type {
  Rol,
  UsuarioFormInput,
  UsuarioFormOutput,
} from "../lib/usuario.schema"

import { Button } from "@/components/ui//button"
import { FormInput } from "@/components/form/FormInput"
import { FormInputPassword } from "@/components/form/FormInputPassword"
import { FormSelect } from "@/components/form/FormSelect"
import { FieldGroup } from "@/components/ui//field"
import { DialogClose, DialogFooter } from "@/components/ui//dialog"

const roles = rolEnum.map((rol) => ({
  value: rol,
  label: rol.charAt(0).toUpperCase() + rol.slice(1),
}))

interface UsuarioFormProps {
  onClose?: () => void
}

export function UsuarioForm({ onClose }: UsuarioFormProps) {
  const { control, handleSubmit, reset } = useForm<UsuarioFormInput>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nombre: "",
      usuario: "",
      password: "",
      rol: "" as Rol,
      estado: true,
    },
  })

  function onSubmit(data: UsuarioFormInput) {
    const validated: UsuarioFormOutput = usuarioSchema.parse(data)
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
        <FormInput name="nombre" label="Nombre completo" control={control} />
        <FormInput name="usuario" label="Usuario" control={control} />
        <FormInputPassword
          name="password"
          label="Contraseña"
          control={control}
        />
        <FormSelect
          name="rol"
          control={control}
          label="Rol"
          placeholder="Selecciona un rol"
          options={roles}
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
