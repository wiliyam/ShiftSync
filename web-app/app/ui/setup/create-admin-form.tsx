'use client';

import { createAdmin, type SetupState } from '@/app/lib/setup-actions';
import { useActionState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';

export default function CreateAdminForm() {
    const initialState: SetupState = { message: null, errors: {} };
    const [state, dispatch] = useActionState(createAdmin, initialState);

    return (
        <form action={dispatch} className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 dark:bg-zinc-900">
                <div className="w-full">
                    {/* Name */}
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-zinc-200"
                            htmlFor="name"
                        >
                            Full Name
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 text-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.name &&
                                state.errors.name.map((error: string) => (
                                    <p key={error} className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-zinc-200"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 text-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        <div id="email-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.email &&
                                state.errors.email.map((error: string) => (
                                    <p key={error} className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-zinc-200"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 text-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password (min 6 chars)"
                                required
                                minLength={6}
                            />
                        </div>
                        <div id="password-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.password &&
                                state.errors.password.map((error: string) => (
                                    <p key={error} className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                </div>
                <Button className="mt-4 w-full" aria-disabled={false}>
                    Create Admin Account <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                </Button>
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                </div>
            </div>
        </form>
    );
}
