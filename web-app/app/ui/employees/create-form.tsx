'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { createEmployee, State } from '@/app/lib/employee-actions';

// We pass initialState
const initialState: State = { message: null, errors: {} };

export default function CreateEmployeeForm() {
    const [state, dispatch] = useActionState(createEmployee, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-card p-4 md:p-6 border border-border">
                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                        aria-describedby="name-error"
                    />
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                        aria-describedby="email-error"
                    />
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Max Hours */}
                <div className="mb-4">
                    <label htmlFor="maxHours" className="mb-2 block text-sm font-medium">
                        Max Hours / Week
                    </label>
                    <input
                        id="maxHours"
                        name="maxHours"
                        type="number"
                        defaultValue={40}
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                        aria-describedby="maxHours-error"
                    />
                    <div id="maxHours-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.maxHours &&
                            state.errors.maxHours.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                    <label htmlFor="skills" className="mb-2 block text-sm font-medium">
                        Skills (comma separated)
                    </label>
                    <input
                        id="skills"
                        name="skills"
                        type="text"
                        placeholder="Bartender, Server"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                        aria-describedby="skills-error"
                    />
                    <div id="skills-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.skills &&
                            state.errors.skills.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {state.message ? (
                        <p className="mt-2 text-sm text-destructive">{state.message}</p>
                    ) : null}
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/employees"
                    className="flex h-10 items-center rounded-lg bg-muted px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                >
                    Cancel
                </Link>
                <button type="submit" className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Create Employee
                </button>
            </div>
        </form>
    );
}
