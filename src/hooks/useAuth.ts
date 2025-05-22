"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requiredRole?: string) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (
      status === "authenticated" &&
      requiredRole &&
      session.user?.role !== requiredRole
    ) {
      redirect("/unauthorized");
    }
  }, [status, session, requiredRole]);

  return { session, status };
}
