"use client"

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Calendar, Mail, User, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: "Início", icon: Home, href: "/dashboard" },
    { name: "Agenda", icon: Calendar, href: "/agenda" },
    // { name: "Mensagens", icon: Mail, href: "/mensagens" },
    { name: "Perfil", icon: User, href: "/perfil" },
  ];

  if (session?.user.role === "COORDENACAO") {
    navItems.push({
      name: "Painel Admin",
      icon: Settings,
      href: "/admin",
    });
  }

  return (
    <div className="hidden border-r bg-[#274934] md:block w-[220px]">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-19 items-center border-b px-4 text-white gap-2">
          <Image src={"/logo.png"} alt="Logo Estuda Fácil" width={40} height={40} />
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span>Estuda Fácil</span>
            </Link>
            <span className="text-xs opacity-80 font-sans">
              {session?.user.nome || "Usuário"}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <nav className="flex flex-col w-full items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "flex w-full items-center px-4 py-5 rounded-md transition-colors justify-between",
                    pathname === item.href
                      ? "bg-primary-foreground/10 text-primary-foreground"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <div className="flex gap-1.5">
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </div>

                    {isActive && <span className="flex h-2 w-2 rounded-full bg-white" />}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="text-xs text-muted-foreground">
            Estuda Fácil v1.0
            <br />© 2025 Todos os direitos reservados
          </div>
        </div>
      </div>
    </div>
  );
}
