'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const data = Object.fromEntries(formData.entries());

        if (!data.email || !data.password) {
            return 'Please enter both email and password.';
        }

        await signIn('credentials', data);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid email or password. Please try again.';
                case 'AccessDenied':
                    return 'Access denied. Your account may be disabled.';
                default:
                    return 'Authentication failed. Please try again later.';
            }
        }
        throw error;
    }
}
