"use client";

import { Nav } from "@/components/Nav";
import ContainerApiTest from "./components/ContainerApiTest";

export default function PainelAdminPage() {
  return (
    <div>
      {/* Adicionar tag de Auth */}
      <Nav />
      <h1 className="text-3xl p-[2rem]">Painel Admin (Restrito)</h1>
      <ContainerApiTest />
    </div>
  );
}
