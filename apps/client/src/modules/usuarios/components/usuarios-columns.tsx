"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  PencilIcon,
  Trash2Icon,
  ToggleLeftIcon,
  ToggleRightIcon,
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

import { useToggleUsuario, useDeleteUsuario } from "../hooks/useUsuarios"
import { UsuarioEditDialog } from "./UsuarioDialog"
import { rolLabels } from "../lib/usuario.schema"
import type { Usuario } from "../types/usuario.types"

const rolVariant: Record<string, "default" | "secondary" | "outline"> = {
  administrador: "default",
  responsable_almacen: "secondary",
  solicitador: "outline",
  aprobador: "outline",
  auditor: "outline",
}

// ── Celda de acciones ─────────────────────────────────────────────────────────
function AccionesCell({ usuario }: { usuario: Usuario }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { mutate: toggle, isPending: isToggling } = useToggleUsuario()
  const { mutate: remove, isPending: isDeleting } = useDeleteUsuario()

  function handleDelete() {
    setDeleteError(null)
    remove(usuario.id, {
      onSuccess: () => setDeleteOpen(false),
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
            setDeleteOpen(true)
          }}
          disabled={isDeleting}
          title="Eliminar"
        >
          <Trash2Icon className="text-destructive" />
        </Button>
      </div>

      {/* Dialog de edición */}
      <UsuarioEditDialog
        usuario={usuario}
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
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El usuario{" "}
              <span className="font-semibold">{usuario.nombre}</span> será
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

// ── Definición de columnas ────────────────────────────────────────────────────
export const usuariosColumns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "usuario",
    header: "Usuario",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.getValue("usuario")}
      </span>
    ),
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => {
      const rol = row.getValue<string>("rol")
      return (
        <Badge variant={rolVariant[rol] ?? "outline"}>
          {rolLabels[rol as keyof typeof rolLabels] ?? rol}
        </Badge>
      )
    },
  },
  {
    accessorKey: "unidad",
    header: "Unidad",
    cell: ({ row }) => {
      const unidad = row.getValue<Usuario["unidad"]>("unidad")
      if (!unidad) {
        return <span className="text-xs text-muted-foreground">—</span>
      }
      return (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {unidad.sigla}
          </span>
          {unidad.nombre}
        </span>
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
    cell: ({ row }) => <AccionesCell usuario={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
