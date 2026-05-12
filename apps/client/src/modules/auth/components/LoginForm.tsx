"use client"

import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui//button"
import { Card, CardContent } from "@/components/ui//card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui//field"

import { FormInput } from "@/components/form/FormInput"
import { loginSchema } from "../lib/usuario.schema"
import { FormInputPassword } from "@/components/form/FormInputPassword"
import type { LoginFormInput, LoginFormOutput } from "../lib/usuario.schema"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { control, handleSubmit } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: "",
      password: "",
    },
  })

  function onSubmit(data: LoginFormInput) {
    const validated: LoginFormOutput = loginSchema.parse(data)
    console.log(validated)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-extrabold">SISTEMA</h1>
                <p className="text-balance text-muted-foreground">
                  Inicia sesión con tu cuenta.
                </p>
              </div>

              <FormInput name="usuario" label="Usuario" control={control} />
              <FormInputPassword
                name="password"
                label="Contraseña"
                control={control}
              />

              <Field className="mt-4">
                <Button type="submit">Iniciar sesión</Button>
              </Field>

              <FieldDescription className="text-center">
                ¿No tienes cuenta? <a href="#">Regístrate</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
