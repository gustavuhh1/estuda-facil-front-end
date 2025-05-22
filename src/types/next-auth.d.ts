// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    role: "ALUNO" | "PROFESSOR" | "COORDENACAO";
  }

  interface Session extends DefaultSession {
    user?: User;
  }
}
