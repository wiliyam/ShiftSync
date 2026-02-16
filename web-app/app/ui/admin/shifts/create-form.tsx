'use client';

import { createShift } from '@/app/lib/shift-actions';
import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

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
            <div className="space-y-2">
                <Label htmlFor="locationId">Location</Label>
                <select
                    id="locationId"
                    name="locationId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="employeeId">Employee (Optional)</Label>
                <select
                    id="employeeId"
                    name="employeeId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                <div className="space-y-2">
                    <Label htmlFor="start">Start Time</Label>
                    <Input
                        id="start"
                        type="datetime-local"
                        name="start"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end">End Time</Label>
                    <Input
                        id="end"
                        type="datetime-local"
                        name="end"
                        required
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="flex items-center gap-4 mt-6">
                <Button variant="outline" asChild>
                    <Link href="/admin/shifts">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Shift'}
                </Button>
            </div>
        </form>
    );
}
