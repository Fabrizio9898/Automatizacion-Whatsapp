import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// Importa el tipo inferido de tu Zod schema
import type { ContactoInput } from "@/lib/validations/contactos";

export function useContactos() {
  const queryClient = useQueryClient();

  // 1. LEER: Obtener todos los contactos de la DB
  const contactosQuery = useQuery({
    queryKey: ["contactos"],
    queryFn: async () => {
      const res = await fetch("/api/contactos");
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Error al obtener contactos");
      }
      return json.data; // Retorna el array de contactos
    },
  });

  // 2. CREAR: Insertar un contacto (útil para pruebas o carga manual)
  const mutacionCrear = useMutation({
    mutationFn: async (nuevoContacto: ContactoInput) => {
      const res = await fetch("/api/contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoContacto),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      // Obliga a React Query a volver a ejecutar el GET para actualizar la tabla
      queryClient.invalidateQueries({ queryKey: ["contactos"] });
      toast.success("Contacto guardado en la base de datos");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al guardar el contacto");
    },
  });

  // 3. ELIMINAR TODOS: Vaciar la tabla
  const mutacionVaciar = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/contactos", { method: "DELETE" });
      const json = await res.json();

      if (!json.success) throw new Error(json.error);
      return json;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["contactos"] });
      toast.success(data.message || "Lista de contactos vaciada");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al vaciar la lista");
    },
  });

  // Retornamos todo empacado para usarlo limpio en la UI
  return {
    contactos: contactosQuery.data || [],
    isLoading: contactosQuery.isLoading,
    isError: contactosQuery.isError,
    crearContacto: mutacionCrear,
    vaciarContactos: mutacionVaciar,
  };
}
