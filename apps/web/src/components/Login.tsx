// app/(auth)/login/components/login-form.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const form = useForm({
    // Eliminado: validatorAdapter: zodValidator()
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      // TODO: Manejo post-login con better-auth
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
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
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
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
           
          </div>
        )}
      />

      <Button type="submit" className="w-full">
        Ingresar
      </Button>
    </form>
  );
}
