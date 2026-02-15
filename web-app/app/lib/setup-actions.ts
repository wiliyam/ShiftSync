'use server';

import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function checkUsersExist() {
    try {
        const count = await prisma.user.count();
        return count > 0;
    } catch (error) {
        console.error('Failed to check users:', error);
        // If DB is not reachable, we probably can't run setup either, but return false to be safe?
        // Or handle error gracefully.
        return false;
    }
}

const SetupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SetupState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
};

export async function createAdmin(prevState: SetupState, formData: FormData) {
    // 1. Double check no users exist (security)
    const count = await prisma.user.count();
    if (count > 0) {
        return { message: 'Setup is already complete. Users exist.' };
    }

    const validatedFields = SetupSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Admin.',
        };
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.ADMIN,
            },
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Create Admin.' };
    }

    redirect('/login');
}
