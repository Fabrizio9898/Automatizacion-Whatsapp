import { redirect } from "next/navigation";
import type { Route } from "next"; // <-- 1. Importás el tipo
export default function DashboardRootPage() {
  // Si alguien entra a /dashboard pelado, lo empujamos a la tab por defecto
  redirect("/dashboard/contacts" as Route);
}
