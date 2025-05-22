"use client";

import Sidebar from "@/components/layout/Sidebar";
import ContainerApiTest from "./components/ContainerApiTest";

export default function PainelAdminPage() {
  return (
    <div>
      <Sidebar />
      <h1 className="text-3xl py-6 px-12">Painel Admin (Restrito)</h1>
      <ContainerApiTest />
    </div>
  );
}
