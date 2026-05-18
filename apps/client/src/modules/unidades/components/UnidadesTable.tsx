import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/common/components/DataTable"
import { unidadesColumns } from "./unidades-columns"
import { useUnidades } from "../hooks/useUnidades"
import { usePagination } from "@/common/hooks/usePagination"

export function UnidadesTable() {
  const { pagination, search, setPage, setLimit, setSearch } = usePagination({
    initialLimit: 10,
  })

  const [inputValue, setInputValue] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 400)
    return () => clearTimeout(timer)
  }, [inputValue, setSearch])

  const { data, isLoading, isError } = useUnidades({
    ...pagination,
    search: search || undefined,
  })

  return (
    <div className="space-y-3">
      <Input
        placeholder="Buscar por nombre o sigla..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="max-w-xs"
      />

      <DataTable
        columns={unidadesColumns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Error al cargar las unidades. Intenta de nuevo."
        paginationMeta={data?.meta}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  )
}
