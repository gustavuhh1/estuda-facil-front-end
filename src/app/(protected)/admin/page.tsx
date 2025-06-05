"use client";

import ContainerApiTest from "./components/ContainerApiTest";
import { Toaster } from "@/components/ui/sonner";

export default function PainelAdminPage() {
  return (
    <div>
      <h1 className="text-3xl py-6 px-12">Painel Admin (Restrito)</h1>
      <ContainerApiTest />
      <Toaster/>
    </div>
  );
}
