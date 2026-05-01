import { z } from "zod";

export const contactoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  // Validamos que tenga un formato mínimo para WhatsApp (código de país)
  numero: z
    .string()
    .min(8, "Debe incluir código de país (ej. +54911...)")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length >= 10 && val.length <= 15, {
      message:
        "El número debe incluir código de país (ej. 54911...) y ser válido.",
    }),
});

export type ContactoInput = z.infer<typeof contactoSchema>;
