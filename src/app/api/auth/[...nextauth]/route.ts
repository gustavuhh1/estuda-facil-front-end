import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // ou o caminho onde você salvou

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };