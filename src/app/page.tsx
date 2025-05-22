"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
        <p className="text-xl text-gray-600">Estuda Fácil - Sistema de Gestão Escolar</p>
      </div>
    </div>
  );
}
