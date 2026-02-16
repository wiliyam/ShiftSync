'use client';

import { createLocation } from '@/app/lib/location-actions';
import { useActionState } from 'react';
import Link from 'next/link';

export default function CreateLocationForm() {
    const [errorMessage, formAction, isPending] = useActionState(createLocation, undefined);

    return (
        <form action={formAction} className="space-y-4 max-w-lg mx-auto p-6 bg-card rounded-xl shadow-md border border-border">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Location Name
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    minLength={2}
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Downtown Office"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Address (Optional)
                </label>
                <textarea
                    name="address"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="123 Main St, City, Country"
                />
            </div>

            {errorMessage && (
                <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="flex items-center gap-4 mt-6">
                <Link
                    href="/admin/locations"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {isPending ? 'Creating...' : 'Create Location'}
                </button>
            </div>
        </form>
    );
}
