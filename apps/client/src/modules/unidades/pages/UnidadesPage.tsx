import { UnidadDialog } from "../components/UnidadDialog"
import { UnidadesTable } from "../components/UnidadesTable"

export default function UnidadesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary dark:text-foreground">
            Unidades
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las unidades del sistema.
          </p>
        </div>
        <UnidadDialog />
      </div>

      <UnidadesTable />
    </div>
  )
}
