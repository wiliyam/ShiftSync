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

import { authConfig } from './auth.config';

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
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
