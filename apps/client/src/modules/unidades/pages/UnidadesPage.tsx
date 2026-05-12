"use client"

import { UnidadDialog } from "../components/UnidadDialog"

export default function UnidadesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary dark:text-foreground">
            Unidades
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las unidades.
          </p>
        </div>
        <UnidadDialog />
      </div>

      {/* TODO: tabla de usuarios */}
    </div>
  )
}
