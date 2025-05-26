import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        // TODO: Trocar user por requisição http
        const res = await axios.post("/auth/login", {
          email: credentials?.email,
          password: credentials?.password
        })
        const user = await res.data;

        const user = {
          id: "9b4f3672-f887-4055-a177-fec19da37ebd",
          email: "gustavo@email.com",
          password: "password",
          role: "COORDENACAO",
        };

        const isValidEmail = user.email === credentials?.email;
        const isValidPassword = user.password === credentials?.password;
        if (!isValidEmail || !isValidPassword) {
          return false;
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}