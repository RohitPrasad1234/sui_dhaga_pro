import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdmin = auth?.user?.role === 'admin';
            const isTailor = auth?.user?.role === 'tailor';

            // Example path protection
            const isDashboardUser = nextUrl.pathname.startsWith('/dashboard/user');
            const isDashboardTailor = nextUrl.pathname.startsWith('/dashboard/tailor');
            const isDashboardAdmin = nextUrl.pathname.startsWith('/dashboard/admin');

            if (isDashboardAdmin) {
                if (isLoggedIn && isAdmin) return true;
                return false;
            }

            if (isDashboardTailor) {
                if (isLoggedIn && (isTailor || isAdmin)) return true;
                return false;
            }

            if (isDashboardUser) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.role) {
                session.user.role = token.role as string;
            }
            if (token?.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: [], // To be added in auth.ts
} satisfies NextAuthConfig;
