// apps/web/app/actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_id");

  // El redirect SIEMPRE tiene que estar fuera del try/catch
  // o ser lo último que se ejecute sin que nada lo ataje.
  redirect("/login");
}
