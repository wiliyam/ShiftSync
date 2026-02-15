'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useFormStatus } from 'react-dom';

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="mt-4 w-full bg-primary text-primary-foreground rounded-md py-2 px-4 hover:opacity-90 transition-opacity disabled:opacity-50"
            aria-disabled={pending}
        >
            {pending ? 'Logging in...' : 'Log in'}
        </button>
    );
}

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="flex flex-col gap-4">
            <div>
                <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="email">
                    Email
                </label>
                <input
                    className="block w-full rounded-md border border-input bg-background py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@shiftsync.com"
                    required
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="password">
                    Password
                </label>
                <input
                    className="block w-full rounded-md border border-input bg-background py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                />
            </div>
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <p className="text-sm text-destructive">{errorMessage}</p>
                )}
            </div>
            <LoginButton />
        </form>
    );
}
