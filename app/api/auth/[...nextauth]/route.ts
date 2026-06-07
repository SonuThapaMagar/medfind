import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// NextAuth() takes your config and returns two handlers:
// GET handles: /api/auth/session, /api/auth/signin, /api/auth/signout
// POST handles: /api/auth/signin (form submission), /api/auth/signout
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }