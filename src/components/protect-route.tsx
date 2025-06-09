"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const session = useSession()

  useEffect(() => {
    setIsAuthenticated(session.status === "authenticated");
  }, [session.status]);

  if (isAuthenticated === null) {
    return null; // Ou um loading spinner
  }

  if (isAuthenticated) {
    return redirect("/dashboard");
  }

  return children;
}
