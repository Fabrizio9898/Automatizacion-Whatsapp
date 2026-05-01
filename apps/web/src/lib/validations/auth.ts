import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Formato de correo inválido"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;
