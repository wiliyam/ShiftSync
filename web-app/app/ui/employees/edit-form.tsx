'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { updateEmployee, State } from '@/app/lib/employee-actions';

// Define the shape of the employee prop
type Employee = {
    id: string;
    name: string | null;
    email: string | null;
    employee: {
        skills: string[];
        maxHoursPerWeek: number;
    } | null;
};

export default function EditEmployeeForm({ employee }: { employee: Employee }) {
    const initialState: State = { message: null, errors: {} };
    const updateEmployeeWithId = updateEmployee.bind(null, employee.id);
    const [state, dispatch] = useActionState(updateEmployeeWithId, initialState);

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
                        defaultValue={employee.name || ''}
                        placeholder="John Doe"
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                    />
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
                        defaultValue={employee.email || ''}
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                    />
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
                        defaultValue={employee.employee?.maxHoursPerWeek || 40}
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                    />
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
                        defaultValue={employee.employee?.skills.join(', ') || ''}
                        className="peer block w-full rounded-md border border-input py-2 px-3 text-sm outline-2 placeholder:text-muted-foreground"
                    />
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
                    Edit Employee
                </button>
            </div>
        </form>
    );
}
