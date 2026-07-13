import { auth } from "@/auth"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/app")) {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ["/app/:path*", "/api/chat"],
}
