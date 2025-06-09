"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function App() {
  const session = useSession()
  const router = useRouter();

  useEffect(() => {
    if (!session.data?.user.accessToken) {
      redirect('/login');
    } else {
      redirect('/dashboard');
    }
  }, [router, session]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
        <p className="text-xl text-gray-600">Estuda Fácil - Sistema de Gestão Escolar</p>
      </div>
    </div>
  );
}
