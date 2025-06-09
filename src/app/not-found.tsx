"use client";

import { ArrowBigLeft, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Erro: O usuário tentou acessar uma rota inexistente:", pathname);
    toast.warning("Erro 404", {
      description: `O usuário tentou acessar uma rota inexistente: ${pathname}`
    });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <CircleHelp className="mb-30" size={90} />
      <div className="flex hover:text-blue-500 underline hover:no-underline">
        <ArrowBigLeft />
        <Link className="" href={"/"}>
          Voltar para Início
        </Link>
      </div>
      <h2 className="text-2xl">Página não encontrada</h2>
    </div>
    
  );
}
