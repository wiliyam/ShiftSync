'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" size="lg" disabled={pending}>
            {pending ? 'Logging in...' : 'Log in'}
        </Button>
    );
}

export default function LoginForm() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="flex flex-col gap-5">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@shiftsync.com"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                />
            </div>
            <div className="min-h-[44px]" aria-live="polite">
                {errorMessage && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                        <AlertCircle className="size-4 shrink-0" />
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
            <LoginButton />
        </form>
    );
}
