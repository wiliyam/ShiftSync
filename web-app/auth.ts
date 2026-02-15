import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { employee: true }, // Include employee details if needed
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                // Add role to session if we want to use it on client
                // This is a simplified example.
            }
            return session;
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    // In a real app, passwords should be hashed.
                    // For the seed data 'hashed-password-placeholder', we might bypass check or assume real hash.
                    // Here we assume real hash comparison:
                    // const passwordsMatch = await bcrypt.compare(password, user.password);

                    // FOR DEMO/DEV with Seed data (which isn't really hashed with bcrypt in the seed string):
                    // We will strictly compare or look for the placeholder.
                    // In production, ALWAYS use bcrypt.compare.

                    let passwordsMatch = false;
                    if (user.password === 'hashed-password-placeholder') {
                        // Allow 'password' as the password for the seed user
                        passwordsMatch = password === 'password';
                    } else {
                        passwordsMatch = await bcrypt.compare(password, user.password);
                    }

                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
