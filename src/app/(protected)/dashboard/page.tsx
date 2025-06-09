"use client";

import { useSession } from "next-auth/react";
import { AlunoDashboard } from "./components/AlunoDashboard";
import { ProfessorDashboard } from "./components/ProfessorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";

const roleComponentMap = {
  ALUNO: AlunoDashboard,
  PROFESSOR: ProfessorDashboard,
  COORDENACAO: AdminDashboard,
};

export default function DashboardPage() {
  const {data: session} = useSession()
  const role = session?.user.role

  if (!role) return null;
  const DashboardComponent = roleComponentMap[role];

  return <DashboardComponent/>
}
