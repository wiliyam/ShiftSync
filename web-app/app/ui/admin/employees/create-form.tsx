'use client';

import { createEmployee, State } from '@/app/lib/employee-actions';
import { useActionState } from 'react';

export default function CreateEmployeeForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction, isPending] = useActionState(createEmployee, initialState);

    return (
        <form action={formAction} className="space-y-4 max-w-lg mx-auto p-6 bg-card rounded-xl shadow-md border border-border">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="John Doe"
                    aria-describedby="name-error"
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="john@example.com"
                    aria-describedby="email-error"
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="******"
                    aria-describedby="password-error"
                />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.password?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Max Hours / Week
                </label>
                <input
                    type="number"
                    name="maxHours"
                    required
                    defaultValue={40}
                    min={1}
                    max={168}
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    aria-describedby="maxHours-error"
                />
                <div id="maxHours-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.maxHours?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>

            {state.message && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                    <p>{state.message}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
                {isPending ? 'Creating...' : 'Create Employee'}
            </button>
        </form>
    );
}
