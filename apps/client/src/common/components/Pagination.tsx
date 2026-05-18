import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {/* Info de registros */}
      <p className="text-sm whitespace-nowrap text-muted-foreground">
        {total === 0
          ? "Sin resultados"
          : `${from}–${to} de ${total} registro${total !== 1 ? "s" : ""}`}
      </p>

      <div className="flex items-center gap-4">
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

        {/* Indicador de página */}
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          Página {page} de {totalPages || 1}
        </span>

        {/* Controles de navegación */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(1)}
            disabled={!meta.hasPrevPage}
            title="Primera página"
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!meta.hasPrevPage}
            title="Página anterior"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!meta.hasNextPage}
            title="Página siguiente"
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!meta.hasNextPage}
            title="Última página"
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
