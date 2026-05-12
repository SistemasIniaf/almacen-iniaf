import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui//button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui//dialog"
import { UsuarioForm } from "./UsuarioForm"

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
        </DialogHeader>

        <UsuarioForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
