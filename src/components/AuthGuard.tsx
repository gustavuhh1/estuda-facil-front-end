"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [validando, setValidando] = useState(true);

  useEffect(() => {
    const logado = localStorage.getItem("logado") === "true";
    if (!logado) {
      router.push("/login");
    } else {
      setValidando(false);
    }
  }, [router]);

  if (validando) return null;

  return <>{children}</>;
}
