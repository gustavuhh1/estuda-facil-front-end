import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

// Configuração do usuário de demonstração
const DEMO_USER = {
  id: "demo-user-id",
  email: "gustavo@estudafacil.edu.br",
  name: "Gustavo Martins",
  role: "admin",
  token: "demo-token-123456",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Modo de demonstração
          if (
            credentials?.email === DEMO_USER.email &&
            credentials?.password === "password"
          ) {
            return DEMO_USER;
          }

          // Login real com backend (substitua pela sua chamada API)
          // const response = await fetch(...)
          // const user = await response.json();

          // Simulando resposta da API
          const user = {
            id: "user-id",
            email: credentials?.email,
            name: "Usuário Teste",
            role: "student",
            token: "jwt-token-simulado",
          };

          return user || null;
        } catch (error) {
          console.error("Erro de autenticação:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
