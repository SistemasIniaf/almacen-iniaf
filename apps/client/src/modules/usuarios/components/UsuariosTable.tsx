import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/common/components/DataTable"
import { usuariosColumns } from "./usuarios-columns"
import { useUsuarios } from "../hooks/useUsuarios"
import { usePagination } from "@/common/hooks/usePagination"

export function UsuariosTable() {
  const { pagination, search, setPage, setLimit, setSearch } = usePagination({
    initialLimit: 10,
  })

  // inputValue es lo que ve el usuario; search es lo que se envía a la API
  const [inputValue, setInputValue] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 400)
    return () => clearTimeout(timer)
  }, [inputValue, setSearch])

  const { data, isLoading, isError } = useUsuarios({
    ...pagination,
    search: search || undefined,
  })

  return (
    <div className="space-y-3">
      {/* Input fuera de DataTable para que no pierda el foco al re-renderizar */}
      <Input
        placeholder="Buscar por nombre, usuario o unidad..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="max-w-xs"
      />
      <DataTable
        columns={usuariosColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Error al cargar los usuarios. Intenta de nuevo."
        paginationMeta={data?.meta}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  )
}
