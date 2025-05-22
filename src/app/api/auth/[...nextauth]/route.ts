import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Usuário mock para demonstração
const DEMO_USER = {
  id: "demo-user-id",
  email: "gustavo@estudafacil.edu.br",
  name: "Gustavo Martins",
  role: "student",
  token: "demo-token-123456",
};

export const authOptions = {
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

          // Login real com backend Java
          const response = await axios.post("http://seu-backend-java/api/auth/login", {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = response.data;

          if (user && user.token) {
            return {
              id: user.id || "user-id",
              email: user.email,
              name: user.name || user.email,
              role: user.role || "student",
              token: user.token,
            };
          }
          return null;
        } catch (error) {
          console.error("Erro de autenticação:", error);
          return null;
        }
      },
    }),
  ],
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
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: SessionStrategy.JWT,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
