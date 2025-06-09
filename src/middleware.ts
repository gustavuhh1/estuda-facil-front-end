import { NextAuthMiddlewareOptions, NextRequestWithAuth, withAuth } from "next-auth/middleware"


const middleware = (request: NextRequestWithAuth) => {
    console.log("[MIDDLEWARE_NEXTAUTH_TOKEN]: ", request.nextauth)
    const user = request.nextauth.token;
    const { pathname } = request.nextUrl

    if (!user?.accessToken) {
      return Response.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/admin") && user.role !== "COORDENACAO") {
      return Response.redirect(new URL("/404", request.url));
    }
  
}

const callbackOptions: NextAuthMiddlewareOptions = {}

export default withAuth(middleware, callbackOptions);
export const config = {
    matcher: ['/dashboard', '/admin', '/agenda', '/perfil']
}