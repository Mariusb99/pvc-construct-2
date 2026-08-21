import type { NextAuthConfig } from "next-auth";

/**
 * Config de bază, fără providers care ating baza de date (pg nu rulează pe
 * Edge runtime). Middleware-ul folosește doar acest config pentru a verifica
 * tokenul JWT — providerul Credentials (cu acces la DB) se adaugă separat
 * în `src/lib/auth/index.ts`, folosit doar în rute Node.js.
 */
export const authConfig: NextAuthConfig = {
  // Necesar pentru găzduire în spatele unui reverse proxy / platforme cloud
  // (Vercel, Railway, VPS cu Nginx etc.) unde header-ul Host este de încredere.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminArea = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }
        return true;
      }

      if (isAdminArea) {
        return isLoggedIn;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "VANZARI";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
