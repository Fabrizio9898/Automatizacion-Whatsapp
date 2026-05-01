// app/(auth)/login/page.tsx

import { LoginForm } from "@/components/Login";

export const metadata = {
  title: "Login | n8nWhatsapp",
  description: "Iniciar sesión en la plataforma n8nWhatsapp",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 sm:px-6 lg:px-8 dark:bg-neutral-950">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
        {/* Encabezado */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Automatizaciones WhatsApp
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ingresa tus credenciales para acceder al panel de administración
          </p>
        </div>

        {/* Componente del formulario (Atómico) */}
        <div className="mt-8">
          <LoginForm/>
        </div>
      </div>
    </div>
  );
}
