"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  ImagePlus,
  Send,
  X,
  CheckCheck,
  Eye,
  AlertTriangle,
  DollarSign,
  Users,
  MessageSquareText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCampaignStore } from "@/app/store/campaign.store";
import { useUploadThing } from "@/lib/uploadthing";
import Header from "@/components/pages/header";

const COST_PER_MESSAGE = 0.05;
const MOCK_CONTACTS_COUNT = 150;

export default function CampaignPage() {
  const { message, setMessage, setImageData,imageUrl } = useCampaignStore();

  // 1. Estados Locales para el manejo diferido
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. UploadThing Hook
  const { startUpload, isUploading } = useUploadThing("campaignImage");

  // Limpieza de memoria para el preview local
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const totalSelected = MOCK_CONTACTS_COUNT;
  const estimatedCost = totalSelected * COST_PER_MESSAGE;
  const hasMessage = message.trim().length > 0;
  const hasImage = !!selectedFile || !!imageUrl;
  const canSend =
    totalSelected > 0 && (hasMessage || hasImage) && !sending && !isUploading;
  // 3. Manejador de selección (No sube, solo previsualiza)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Generar preview local (vive solo en memoria del navegador)
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setSelectedFile(file);

    // Actualizamos el nombre en el store para la UI, pero no la URL todavía
    setImageData(null, file.name);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageData(null, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. Lógica Maestra de Envío
  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);

    try {
      let finalImageUrl = null;

      // Fase A: Subir imagen si existe un archivo seleccionado
      if (selectedFile) {
        const uploadRes = await startUpload([selectedFile]);
        if (uploadRes && uploadRes[0]) {
          finalImageUrl = uploadRes[0].url;
          // Persistimos en Zustand post-subida exitosa
          setImageData(finalImageUrl, selectedFile.name);
        }
      }

      // Fase B: Enviar a n8n
      const payload = {
        message,
        imageUrl: finalImageUrl,
        totalContacts: totalSelected,
        timestamp: new Date().toISOString(),
      };

      console.log("Payload final enviado a n8n:", payload);

      // Simulación de delay de red hacia n8n
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Campaña enviada con éxito");
      // Opcional: resetear campos
      removeImage();
      setMessage("");
    } catch (error) {
      console.error("Error en el proceso de envío:", error);
      alert("Error crítico en el envío de la campaña");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <Header title="Crear nueva campaña" description="Redacta tu mensaje, adjunta una imagen y envíalo a tus contactos de WhatsApp." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="p-0 overflow-hidden border-border">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-md bg-accent text-primary">
                  <MessageSquareText className="size-4" />
                </div>
                <h2 className="text-sm font-semibold">Redactar mensaje</h2>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="min-h-45"
              />

              <div>
                <span className="mb-2 block text-sm font-medium">
                  Adjuntar imagen
                </span>

                {previewUrl ? (
                  <div className="group relative overflow-hidden rounded-md border bg-muted/30">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={previewUrl}
                        alt="Preview local"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex items-center justify-between border-t bg-card px-3 py-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {selectedFile?.name} (Listo para subir)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeImage}
                        className="h-7 text-destructive"
                      >
                        <X className="size-3.5 mr-1" /> Quitar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="image-upload"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center hover:bg-accent/40 transition-colors"
                  >
                    <ImagePlus className="size-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Seleccionar imagen</p>
                  </label>
                )}

                <input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-t bg-muted/30 px-5 py-4">
              <p className="text-xs text-muted-foreground">
                Costo total:{" "}
                <span className="font-bold text-foreground">
                  ${estimatedCost.toFixed(2)}
                </span>
              </p>
              <Button
                onClick={handleSend}
                disabled={!canSend}
                className="min-w-35"
              >
                {sending || isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    {isUploading ? "Subiendo..." : "Enviando..."}
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" /> Enviar campaña
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Lado Derecho: Resumen (Hardcoded) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-semibold">Resumen</h2>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Users className="size-4" /> Contactos
              </span>
              <span className="font-mono">{MOCK_CONTACTS_COUNT}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="size-4" /> Total
              </span>
              <span className="text-2xl font-bold">
                ${estimatedCost.toFixed(2)}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
