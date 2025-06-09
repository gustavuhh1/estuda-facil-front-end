import { Usuario } from "./auth";

declare module "next-auth" {
  interface Session {
    user: Usuario & {
      accessToken?: string;
    };
  }

  interface User extends Usuario{
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Usuario{
    accessToken: string;
  }
}
