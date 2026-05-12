// apps/web/components/contactos/import-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, DownloadCloud, Loader2 } from "lucide-react";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progress: number;
  stage: "loading" | "success";
}

export function ImportModal({
  open,
  onOpenChange,
  progress,
  stage,
}: ImportModalProps) {
  // Prevenir cierre al hacer click fuera si está cargando
  const handleInteractOutside = (e: Event) => {
    if (stage === "loading") {
      e.preventDefault();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={stage === "loading" ? undefined : onOpenChange}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={handleInteractOutside}
        onEscapeKeyDown={handleInteractOutside}
      >
        <DialogHeader>
          <DialogTitle>Sincronizando con n8n</DialogTitle>
          <DialogDescription>
            Importando contactos desde la instancia de WhatsApp...
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          {stage === "loading" ? (
            <>
              <div className="relative flex size-16 items-center justify-center rounded-full bg-muted">
                <DownloadCloud
                  className="size-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <Loader2 className="absolute -right-2 -top-2 size-6 animate-spin text-primary" />
              </div>
              <div className="w-full space-y-2">
                <Progress value={progress} className="h-2 w-full" />
                <p className="text-center text-sm font-medium text-muted-foreground tabular-nums">
                  {progress}% completado
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 animate-in zoom-in duration-300">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2
                  className="size-8 text-primary"
                  aria-hidden="true"
                />
              </div>
              <p className="text-center font-medium text-foreground">
                ¡Sincronización completada!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
