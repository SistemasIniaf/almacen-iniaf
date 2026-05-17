import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UnidadForm } from "./UnidadForm"
import { UnidadEditForm } from "./UnidadEditForm"
import type { Unidad } from "../types/unidad.types"

// ── Dialog de creación ────────────────────────────────────────────────────────

export function UnidadDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Nueva unidad
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crear unidad</DialogTitle>
          <DialogDescription>
            Completa los campos para registrar una nueva unidad.
          </DialogDescription>
        </DialogHeader>
        <UnidadForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// ── Dialog de edición ─────────────────────────────────────────────────────────

interface UnidadEditDialogProps {
  unidad: Unidad
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UnidadEditDialog({
  unidad,
  open,
  onOpenChange,
}: UnidadEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar unidad</DialogTitle>
          <DialogDescription>
            Modifica los datos de la unidad.
          </DialogDescription>
        </DialogHeader>
        <UnidadEditForm unidad={unidad} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
