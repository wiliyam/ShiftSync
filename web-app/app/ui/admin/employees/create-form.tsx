'use client';

import { createEmployee, State } from '@/app/lib/employee-actions';
import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function CreateEmployeeForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction, isPending] = useActionState(createEmployee, initialState);

    return (
        <form action={formAction} className="space-y-4 max-w-lg mx-auto p-6 bg-card rounded-xl shadow-md border border-border">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    aria-describedby="name-error"
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.name?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    aria-describedby="email-error"
                />
                <div id="email-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.email?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="******"
                    aria-describedby="password-error"
                />
                <div id="password-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.password?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="maxHours">Max Hours / Week</Label>
                <Input
                    id="maxHours"
                    type="number"
                    name="maxHours"
                    required
                    defaultValue={40}
                    min={1}
                    max={168}
                    aria-describedby="maxHours-error"
                />
                <div id="maxHours-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.maxHours?.map((error: string) => (
                        <p className="mt-1 text-sm text-destructive" key={error}>{error}</p>
                    ))}
                </div>
            </div>

            {state.message && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{state.message}</p>
                </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Employee'}
            </Button>
        </form>
    );
}
