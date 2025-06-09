import api from "@/lib/axios";
import { LoginResponse } from "@/types/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const res = await api.post<LoginResponse>("/auth/login", {
          email: credentials?.email,
          password: credentials?.password
        })
        
        if (res.status !== 200) return null;

        console.log(res.data)
        const {token, usuario} = res.data;

        return {
          ...usuario, 
          accessToken: token, 
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  jwt: {
    maxAge: 2 * 24 * 60 * 60,

  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          ...user
        }
      }
      return token;
    },

    session: async ({ session, token }) => {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role as
          | "ALUNO"
          | "PROFESSOR"
          | "RESPONSAVEL"
          | "COORDENACAO",
        nome: token.nome as string,
        dataNascimento: token.dataNascimento as string | Date | null,
        matricula: token.matricula as string | undefined,
        turmaId: token.turmaId as number | undefined,
        disciplina: token.disciplina as string | null,
        telefoneContato: token.telefoneContato as string | null,
        departamento: token.departamento as string | null | undefined,
        accessToken: token.accessToken as string,
      };
      console.log("Sessao:::" + JSON.stringify(session));
      return session;
    }
  },
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}