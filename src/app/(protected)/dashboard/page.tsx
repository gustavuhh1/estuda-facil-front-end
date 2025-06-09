"use client";

import { useSession } from "next-auth/react";
import { AlunoDashboard } from "./components/AlunoDashboard";
import { ProfessorDashboard } from "./components/ProfessorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";

export default function DashboardPage() {
  const session = useSession()
  const role = session.data?.user.role

  return (
    <>
      {role === "ALUNO" && <AlunoDashboard />}
      {role === "PROFESSOR" && <ProfessorDashboard />}
      {role === "COORDENACAO" && <AdminDashboard />}
    </>
  );
}
