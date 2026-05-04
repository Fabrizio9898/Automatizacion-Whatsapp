// app/(auth)/login/components/login-form.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // <-- Importamos las alertas de Sonner
import { useRouter } from "next/navigation"; // <-- Para redirigir

export function LoginForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const data = await response.json();

        // Si el backend tiró un error (401, 500, etc)
        if (!response.ok) {
          toast.error(data.error || "Error al iniciar sesión");
          return;
        }

        // Si salió todo bien
        toast.success(data.message || "¡Inicio de sesión exitoso!");

        // Redirigimos al dashboard (asegurate de que la ruta sea correcta)
        router.push("/dashboard");
        router.refresh(); // Fuerza a Next.js a actualizar la UI y re-evaluar la sesión
      } catch (error) {
        toast.error("Error de conexión. Intenta nuevamente.");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 w-full"
    >
      <form.Field
        name="email"
        validators={{ onChange: loginSchema.shape.email }}
        children={(field) => (
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email" 
              autoComplete="username"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
        )}
      />

      <form.Field
        name="password"
        validators={{ onChange: loginSchema.shape.password }}
        children={(field) => (
          <div className="space-y-1">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              name="password" 
              autoComplete="current-password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      {/* Usamos form.Subscribe para escuchar si el formulario se está enviando. 
        Así deshabilitamos el botón (disabled) lo que le da el estilo visual correcto
        y evita que el usuario haga doble clic.
      */}
      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>
        )}
      />
    </form>
  );
}
