"use client"

import { useState } from "react"
import {
  PencilIcon,
  Trash2Icon,
  ToggleLeftIcon,
  ToggleRightIcon,
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
  useUsuarios,
  useToggleUsuario,
  useDeleteUsuario,
} from "../hooks/useUsuarios"
import { UsuarioEditDialog } from "./UsuarioDialog"
import { usePagination } from "@/common/hooks/usePagination"
import { Pagination } from "@/common/components/Pagination"
import { rolLabels } from "../lib/usuario.schema"
import type { Usuario } from "../types/usuario.types"

const rolVariant: Record<string, "default" | "secondary" | "outline"> = {
  administrador: "default",
  responsable_almacen: "secondary",
  solicitador: "outline",
  aprobador: "outline",
  auditor: "outline",
}

export function UsuariosTable() {
  const { pagination, setPage, setLimit } = usePagination({ initialLimit: 10 })

  const { data, isLoading, isError } = useUsuarios(pagination)
  const { mutate: toggle, isPending: isToggling } = useToggleUsuario()
  const { mutate: remove, isPending: isDeleting } = useDeleteUsuario()

  const [editTarget, setEditTarget] = useState<Usuario | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null)
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
            "No se pudo eliminar el usuario"
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
        Error al cargar los usuarios. Intenta de nuevo.
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
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">
                    {usuario.nombre}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {usuario.usuario}
                  </TableCell>
                  <TableCell>
                    <Badge variant={rolVariant[usuario.rol] ?? "outline"}>
                      {rolLabels[usuario.rol] ?? usuario.rol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {usuario.unidad ? (
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                          {usuario.unidad.sigla}
                        </span>
                        {usuario.unidad.nombre}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={usuario.activo ? "default" : "secondary"}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditTarget(usuario)}
                        title="Editar"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggle(usuario.id)}
                        disabled={isToggling}
                        title={usuario.activo ? "Desactivar" : "Activar"}
                      >
                        {usuario.activo ? (
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
                          setDeleteTarget(usuario)
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

      {/* Dialog de edición */}
      {editTarget && (
        <UsuarioEditDialog
          usuario={editTarget}
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
        />
      )}

      {/* Confirmación de eliminación */}
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
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario{" "}
              <span className="font-semibold">{deleteTarget?.nombre}</span> será
              eliminado permanentemente.
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
