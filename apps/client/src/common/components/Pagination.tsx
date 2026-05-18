import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { PaginationMeta } from "../types/pagination.types"

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  pageSizeOptions?: number[]
}

export function Pagination({
  meta,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
  const { page, totalPages, total, limit } = meta

  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  // Genera los números de página visibles con elipsis
  function getPageNumbers(): (number | "ellipsis-start" | "ellipsis-end")[] {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "ellipsis-end", totalPages]
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "ellipsis-start",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    return [
      1,
      "ellipsis-start",
      page - 1,
      page,
      page + 1,
      "ellipsis-end",
      totalPages,
    ]
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Info de registros */}
      <p className="text-sm whitespace-nowrap text-muted-foreground">
        {total === 0
          ? "Sin resultados"
          : `${from}–${to} de ${total} registro${total !== 1 ? "s" : ""}`}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        {/* Paginación con componentes de shadcn */}
        <PaginationRoot>
          {/* Selector de tamaño de página */}
          {onLimitChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap text-muted-foreground">
                Filas por página
              </span>
              <Select
                value={String(limit)}
                onValueChange={(val) => onLimitChange(Number(val))}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <PaginationContent>
            {/* Ir a primera página */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onPageChange(1)}
                disabled={!meta.hasPrevPage}
                title="Primera página"
              >
                <ChevronsLeftIcon />
              </Button>
            </PaginationItem>

            {/* Anterior */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(page - 1)}
                aria-disabled={!meta.hasPrevPage}
                className={
                  !meta.hasPrevPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                text="Anterior"
              />
            </PaginationItem>

            {/* Números de página */}
            {pageNumbers.map((p, i) => {
              if (p === "ellipsis-start" || p === "ellipsis-end") {
                return (
                  <PaginationItem key={`${p}-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    onClick={() => onPageChange(p)}
                    isActive={p === page}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {/* Siguiente */}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(page + 1)}
                aria-disabled={!meta.hasNextPage}
                className={
                  !meta.hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                text="Siguiente"
              />
            </PaginationItem>

            {/* Ir a última página */}
            <PaginationItem>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onPageChange(totalPages)}
                disabled={!meta.hasNextPage}
                title="Última página"
              >
                <ChevronsRightIcon />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </PaginationRoot>
      </div>
    </div>
  )
}
