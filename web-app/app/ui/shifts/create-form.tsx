'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { createShift, State } from '@/app/lib/shift-actions';

type Employee = { id: string; name: string | null };
type Location = { id: string; name: string };

const initialState: State = { message: null, errors: {} };

export default function CreateShiftForm({
    employees,
    locations
}: {
    employees: Employee[],
    locations: Location[]
}) {
    const [state, dispatch] = useActionState(createShift, initialState);

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-card p-4 md:p-6 border border-border">
                {/* Employee */}
                <div className="mb-4">
                    <label htmlFor="employeeId" className="mb-2 block text-sm font-medium">
                        Employee
                    </label>
                    <select
                        id="employeeId"
                        name="employeeId"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground bg-background"
                        defaultValue=""
                        aria-describedby="employee-error"
                    >
                        <option value="" disabled>
                            Select an employee
                        </option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                    <div id="employee-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.employeeId &&
                            state.errors.employeeId.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                    <label htmlFor="locationId" className="mb-2 block text-sm font-medium">
                        Location
                    </label>
                    <select
                        id="locationId"
                        name="locationId"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground bg-background"
                        defaultValue=""
                        aria-describedby="location-error"
                    >
                        <option value="" disabled>
                            Select a location
                        </option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                    <div id="location-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.locationId &&
                            state.errors.locationId.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Start Time */}
                <div className="mb-4">
                    <label htmlFor="start" className="mb-2 block text-sm font-medium">
                        Start Time
                    </label>
                    <input
                        id="start"
                        name="start"
                        type="datetime-local"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                        aria-describedby="start-error"
                    />
                    <div id="start-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.start &&
                            state.errors.start.map((error: string) => (
                                <p key={error} className="mt-2 text-sm text-destructive">
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* End Time */}
                <div className="mb-4">
                    <label htmlFor="end" className="mb-2 block text-sm font-medium">
                        End Time
                    </label>
                    <input
                        id="end"
                        name="end"
                        type="datetime-local"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                        aria-describedby="end-error"
                    />
                    <div id="end-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.end &&
                            state.errors.end.map((error: string) => (
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
                    href="/dashboard/shifts"
                    className="flex h-10 items-center rounded-lg bg-muted px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                >
                    Cancel
                </Link>
                <button type="submit" className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Create Shift
                </button>
            </div>
        </form>
    );
}
