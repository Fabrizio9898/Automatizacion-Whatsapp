"use client";

import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  Search,
  Trash2,
  Download,
  Save,
  Users,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Importamos lo que separamos
import { getColumns, type Contact } from "@/components/contactos/column";
import Header from "@/components/pages/header";
const MOCK_CONTACTS: Contact[] = [
  {
    id: crypto.randomUUID(),
    nombre: "Juan Pérez",
    numero: "5491123456789",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    nombre: "María Gómez",
    numero: "5491198765432",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // ... (puedes agregar los demás aquí para probar)
];

export default function ContactsClient() {
  const [data, setData] = useState<Contact[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Funciones de acción
  const handleDeleteOne = (id: string) => {
    setData((prev) => prev.filter((c) => c.id !== id));
    setLastSaved(null);
  };

  const handleBulkDelete = () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);
    setData((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setRowSelection({});
    setLastSaved(null);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setData(MOCK_CONTACTS);
      setIsSyncing(false);
      setLastSaved(null);
    }, 1500);
  };

  const handleSaveToDB = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      setRowSelection({});
    }, 1000);
  };

  // Traemos las columnas desde el módulo, inyectando la función de borrado
  const columns = useMemo(
    () => getColumns({ onDelete: handleDeleteOne }),
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: { rowSelection, globalFilter },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string;
      return value
        ?.toLowerCase()
        .includes((filterValue as string).toLowerCase());
    },
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
        {/* TOOLBAR */}
        <Header
          title="Mis contactos"
          description="Administra tus contactos de WhatsApp. Sincroniza con n8n, guarda cambios y elimina contactos fácilmente."
        />
        <div className="flex shrink-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Buscar..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
              disabled={data.length === 0}
            />
          </div>

          <div className="flex items-center gap-2">
            {Object.keys(rowSelection).length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 size-4" />
                Eliminar ({Object.keys(rowSelection).length})
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Download className="mr-2 size-4" />
              )}
              Sincronizar n8n
            </Button>

            <Button
              size="sm"
              onClick={handleSaveToDB}
              disabled={data.length === 0 || isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : lastSaved ? (
                <CheckCircle2 className="mr-2 size-4" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {lastSaved ? "Guardado" : "Guardar en DB"}
            </Button>
          </div>
        </div>

        {/* TABLA */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
          {data.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Users className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Lista vacía
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sincroniza para ver datos.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No se encontraron contactos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* PAGINACIÓN */}
        {data.length > 0 && (
          <div className="flex shrink-0 items-center justify-between px-1 py-2">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} contactos.
              {lastSaved && (
                <span className="ml-2 text-primary">Sincronizado.</span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
