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

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    // Al cambiar el límite volvemos a la primera página
    setPagination({ page: 1, limit })
  }, [])

  const reset = useCallback(() => {
    setPagination({ page: initialPage, limit: initialLimit })
  }, [initialPage, initialLimit])

  return { pagination, setPage, setLimit, reset }
}
