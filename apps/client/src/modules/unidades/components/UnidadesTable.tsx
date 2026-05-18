import { useState } from "react"
import {
  PencilIcon,
  Trash2Icon,
  ToggleLeftIcon,
  ToggleRightIcon,
  UsersIcon,
} from "lucide-react"
import { isAxiosError } from "axios"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  useUnidades,
  useToggleUnidad,
  useDeleteUnidad,
} from "../hooks/useUnidades"
import { UnidadEditDialog } from "./UnidadDialog"
import { usePagination } from "@/common/hooks/usePagination"
import { Pagination } from "@/common/components/Pagination"
import type { Unidad } from "../types/unidad.types"

export function UnidadesTable() {
  const { pagination, setPage, setLimit } = usePagination({ initialLimit: 10 })

  const { data, isLoading, isError } = useUnidades(pagination)
  const { mutate: toggle, isPending: isToggling } = useToggleUnidad()
  const { mutate: remove, isPending: isDeleting } = useDeleteUnidad()

  const [editTarget, setEditTarget] = useState<Unidad | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Unidad | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function handleDelete() {
    if (!deleteTarget) return
    setDeleteError(null)

    remove(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
      onError: (error) => {
        if (isAxiosError(error)) {
          const message =
            (error.response?.data as { message?: string })?.message ??
            "No se pudo eliminar la unidad"
          setDeleteError(message)
        }
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Error al cargar las unidades. Intenta de nuevo.
      </p>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Sigla</TableHead>
              <TableHead className="text-center">Usuarios</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay unidades registradas.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((unidad) => (
                <TableRow key={unidad.id}>
                  <TableCell className="font-medium">{unidad.nombre}</TableCell>
                  <TableCell>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                      {unidad.sigla}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <UsersIcon className="size-3.5" />
                      {unidad._count.usuarios}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={unidad.activo ? "default" : "secondary"}>
                      {unidad.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditTarget(unidad)}
                        title="Editar"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggle(unidad.id)}
                        disabled={isToggling}
                        title={unidad.activo ? "Desactivar" : "Activar"}
                      >
                        {unidad.activo ? (
                          <ToggleRightIcon className="text-primary" />
                        ) : (
                          <ToggleLeftIcon className="text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setDeleteError(null)
                          setDeleteTarget(unidad)
                        }}
                        disabled={isDeleting}
                        title="Eliminar"
                      >
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {data?.meta && (
        <Pagination
          meta={data.meta}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      )}

      {/* Dialog edición */}
      {editTarget && (
        <UnidadEditDialog
          unidad={editTarget}
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
        />
      )}

      {/* Confirmación eliminación */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
            setDeleteError(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar unidad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La unidad{" "}
              <span className="font-semibold">{deleteTarget?.nombre}</span> será
              eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p className="text-sm text-destructive">{deleteError}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
