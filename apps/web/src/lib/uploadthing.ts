// apps/web/lib/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Mantenemos estos por si acaso
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// *** ESTE ES EL IMPORTANTE AHORA ***
// Exportamos `useUploadThing` para disparar la subida programáticamente
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
