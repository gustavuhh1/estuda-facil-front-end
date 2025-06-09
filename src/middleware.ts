import { NextAuthMiddlewareOptions, NextRequestWithAuth, withAuth } from "next-auth/middleware"


const middleware = (request: NextRequestWithAuth) => {
    console.log("[MIDDLEWARE_NEXTAUTH_TOKEN]: ", request.nextauth)
}

const callbackOptions: NextAuthMiddlewareOptions = {}

export default withAuth(middleware, callbackOptions);
export const config = {
    matcher: ['/dashboard', '/admin', '/agenda', '/perfil']
}