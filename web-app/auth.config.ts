import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) {
                    const role = (auth?.user as any)?.role;
                    if (isOnDashboard && role === 'ADMIN') {
                        return Response.redirect(new URL('/admin', nextUrl));
                    }
                    if (isOnAdmin && role !== 'ADMIN') {
                        return Response.redirect(new URL('/dashboard', nextUrl));
                    }
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && isOnLogin) {
                const role = (auth?.user as any)?.role;
                if (role === 'ADMIN') {
                    return Response.redirect(new URL('/admin', nextUrl));
                }
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = (token as any).role;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
