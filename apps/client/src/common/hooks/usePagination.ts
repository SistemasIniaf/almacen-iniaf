import { useState, useCallback } from "react"
import type { PaginationParams } from "../types/pagination.types"

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

export function usePagination({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationOptions = {}) {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
  })
  const [search, setSearchValue] = useState("")

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    // Al cambiar el límite volvemos a la primera página
    setPagination({ page: 1, limit })
  }, [])

  const setSearch = useCallback((value: string) => {
    setSearchValue(value)
    // Al buscar siempre volvemos a la página 1
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  const reset = useCallback(() => {
    setPagination({ page: initialPage, limit: initialLimit })
    setSearchValue("")
  }, [initialPage, initialLimit])

  return { pagination, search, setPage, setLimit, setSearch, reset }
}
