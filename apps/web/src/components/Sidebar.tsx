"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Users, Megaphone, MessageCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const TABS = [
  {
    href: "/dashboard/contacts",
    label: "Gestión de Contactos",
    description: "Importa y segmenta tu audiencia",
    icon: Users,
  },
  {
    href: "/dashboard/campaign",
    label: "Campaña de Mensajes",
    description: "Redacta y mide tu difusión",
    icon: Megaphone,
  },
] as const;
const handleLogout = async () => {
  console.log("CERRANDO SESIÓN...");
  await logout();
};
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col border-b border-border bg-sidebar lg:h-screen lg:w-72 lg:border-r">
      {/* HEADER: Logo izquierda, Logout derecha */}
      <div className="flex h-16 items-center justify-between px-4 border-b lg:border-b-0 lg:h-auto lg:px-6 lg:py-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <MessageCircle className="size-5" />
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="text-sm font-bold tracking-tight text-sidebar-foreground">
              BroadcastHub
            </p>
            <p className="text-[11px] font-medium text-muted-foreground/80">
              v1.0.4
            </p>
          </div>
        </div>

        {/* Botón Logout */}
       <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
        >
          <LogOut className="size-5" />
        </Button>
      </div>

      {/* NAVEGACIÓN: Row en mobile, Col en desktop */}
      <nav className="flex flex-row overflow-x-auto p-2 gap-1.5 lg:flex-col lg:px-3 lg:py-2 lg:overflow-visible">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href as Route}
              className={cn(
                "group relative flex min-w-fit items-start gap-3 rounded-xl px-4 py-3 transition-all lg:min-w-0",
                isActive
                  ? "bg-sidebar-accent shadow-sm"
                  : "hover:bg-sidebar-accent/50",
              )}
            >
              {/* Indicador visual activo (Desktop) */}
              {isActive && (
                <div className="absolute left-0 top-3 hidden h-6 w-1 rounded-r-full bg-primary lg:block" />
              )}

              <Icon
                className={cn(
                  "mt-0.5 size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-sidebar-foreground",
                )}
              />

              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-semibold leading-tight whitespace-nowrap",
                    isActive
                      ? "text-sidebar-foreground"
                      : "text-muted-foreground group-hover:text-sidebar-foreground",
                  )}
                >
                  {tab.label}
                </span>

                {/* Descripción: Solo visible en Desktop */}
                <span className="mt-1 hidden text-[11px] leading-relaxed text-muted-foreground/80 lg:line-clamp-1">
                  {tab.description}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
