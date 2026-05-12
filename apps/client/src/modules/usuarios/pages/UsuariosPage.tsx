import { UsuarioDialog } from "../components/UsuarioDialog"

export const UsuariosPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary dark:text-foreground">
            Usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios del sistema.
          </p>
        </div>
        <UsuarioDialog />
      </div>

      {/* TODO: tabla de usuarios */}
    </div>
  )
}
