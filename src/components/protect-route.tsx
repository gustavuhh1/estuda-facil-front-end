"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    //melhorar autenticação via cookies
    setIsAuthenticated(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  if (isAuthenticated === null) {
    return null; // Ou um loading spinner
  }

  if (!isAuthenticated) {
    return redirect("/login");
  }

  return children;
}
