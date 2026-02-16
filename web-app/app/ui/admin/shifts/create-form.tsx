'use client';

import { createShift } from '@/app/lib/shift-actions';
import { useActionState } from 'react';
import Link from 'next/link';

// We need to pass locations and employees as props since this is a client component
export default function CreateShiftForm({
    locations,
    employees
}: {
    locations: any[],
    employees: any[]
}) {
    const [errorMessage, formAction, isPending] = useActionState(createShift, undefined);

    return (
        <form action={formAction} className="space-y-4 max-w-lg mx-auto p-6 bg-card rounded-xl shadow-md border border-border">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Location
                </label>
                <select
                    name="locationId"
                    required
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Employee (Optional)
                </label>
                <select
                    name="employeeId"
                    className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="">Unassigned</option>
                    {employees.map((user) => (
                        <option key={user.employee?.id} value={user.employee?.id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        name="start"
                        required
                        className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                        End Time
                    </label>
                    <input
                        type="datetime-local"
                        name="end"
                        required
                        className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="flex items-center gap-4 mt-6">
                <Link
                    href="/admin/shifts"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                    {isPending ? 'Creating...' : 'Create Shift'}
                </button>
            </div>
        </form>
    );
}
