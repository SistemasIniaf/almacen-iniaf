import { useState } from "react"
import { PlusIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { UsuarioForm } from "./UsuarioForm"
import { UsuarioEditForm } from "./UsuarioEditForm"

import type { Usuario } from "../types/usuario.types"

// ── Crear ─────────────────────────────────────────────────────────────────────

export function UsuarioDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Nuevo usuario
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogDescription>
            Completa los campos para registrar un nuevo usuario.
          </DialogDescription>
        </DialogHeader>
        <UsuarioForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// ── Editar ────────────────────────────────────────────────────────────────────

interface UsuarioEditDialogProps {
  usuario: Usuario
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsuarioEditDialog({
  usuario,
  open,
  onOpenChange,
}: UsuarioEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>Modifica los datos del usuario.</DialogDescription>
        </DialogHeader>
        <UsuarioEditForm
          usuario={usuario}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
