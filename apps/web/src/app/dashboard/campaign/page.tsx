"use client";

import React from "react"; // Necesario para los tipos de eventos

import { UploadDropzone } from "@/lib/uploadthing"; // Importar desde tu lib, NO de la librería directamente
import {
  MessageSquareText,
  Image as ImageIcon,
  X,
  Send,
  Users,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useCampaignStore } from "@/app/store/campaign.store";

export default function CampaignPage() {
  const { message, imageUrl, setMessage, setImageUrl } = useCampaignStore();

  // Mock de contactos
  const totalContacts = 150;
  const estimatedCost = totalContacts * 0.05;

  // Tipado manual del evento para evitar el error de 'any'
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = async () => {
    const payload = { message, imageUrl, totalContacts };
    console.log("Enviando a n8n...", payload);
  };

  return (
    <div className="container max-w-6xl p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                <MessageSquareText className="size-4" /> Mensaje
              </label>
              <Textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Escribe tu mensaje..."
                className="min-h-[200px]"
              />
            </div>

            <div className="mt-8 space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="size-4" /> Imagen (UploadThing)
              </label>

              {imageUrl ? (
                <div className="relative aspect-video rounded-xl border overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setImageUrl(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="campaignImage"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) setImageUrl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error:", error.message);
                  }}
                />
              )}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4 text-lg">Resumen</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="size-4" /> Contactos
                </span>
                <span className="font-mono font-bold">{totalContacts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <DollarSign className="size-4" /> Costo
                </span>
                <span className="font-mono font-bold text-green-600">
                  ${estimatedCost.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSend}
                disabled={!message}
              >
                <Send className="mr-2 size-4" /> Enviar Campaña
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
