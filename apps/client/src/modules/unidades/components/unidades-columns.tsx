"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
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

import { useToggleUnidad, useDeleteUnidad } from "../hooks/useUnidades"
import { UnidadEditDialog } from "./UnidadDialog"
import type { Unidad } from "../types/unidad.types"

// ── Celda de acciones ─────────────────────────────────────────────────────────
// Componente separado para poder usar hooks (useState) dentro de la celda
function AccionesCell({ unidad }: { unidad: Unidad }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { mutate: toggle, isPending: isToggling } = useToggleUnidad()
  const { mutate: remove, isPending: isDeleting } = useDeleteUnidad()

  function handleDelete() {
    setDeleteError(null)
    remove(unidad.id, {
      onSuccess: () => setDeleteOpen(false),
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

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setEditOpen(true)}
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
            setDeleteOpen(true)
          }}
          disabled={isDeleting}
          title="Eliminar"
        >
          <Trash2Icon className="text-destructive" />
        </Button>
      </div>

      {/* Dialog de edición */}
      <UnidadEditDialog
        unidad={unidad}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Confirmación de eliminación */}
      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteOpen(false)
            setDeleteError(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar unidad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La unidad{" "}
              <span className="font-semibold">{unidad.nombre}</span> será
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

// ── Definición de columnas ────────────────────────────────────────────────────
export const unidadesColumns: ColumnDef<Unidad>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "sigla",
    header: "Sigla",
    cell: ({ row }) => (
      <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
        {row.getValue("sigla")}
      </span>
    ),
  },
  {
    accessorKey: "_count",
    header: () => <div className="text-center">Usuarios</div>,
    cell: ({ row }) => {
      const count = (row.getValue("_count") as { usuarios: number }).usuarios
      return (
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <UsersIcon className="size-3.5" />
          {count}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "activo",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const activo = row.getValue<boolean>("activo")
      return (
        <div className="flex justify-center">
          <Badge variant={activo ? "default" : "secondary"}>
            {activo ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => <AccionesCell unidad={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
