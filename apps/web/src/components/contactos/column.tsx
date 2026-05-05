"use client";

import { flexRender, type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export type Contact = {
  id: string;
  nombre: string;
  numero: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ColumnProps {
  onDelete: (id: string) => void;
}

// Envolvemos las columnas en una función para poder pasarle métodos (como borrar)
export const getColumns = ({ onDelete }: ColumnProps): ColumnDef<Contact>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Seleccionar fila ${row.index}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "numero",
    header: "Número (WhatsApp)",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-muted-foreground">
        +{row.getValue("numero")}
      </span>
    ),
  },
  {
    id: "acciones",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(row.original.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    ),
  },
];
