import { deleteEmployee } from '@/app/lib/employee-actions';
import Link from 'next/link';

// We define a type for the data we expect
type EmployeeData = {
    id: string; // User ID
    name: string | null;
    email: string | null;
    employee: {
        skills: string[];
        maxHoursPerWeek: number;
    } | null;
};

export default function EmployeeTable({ employees }: { employees: EmployeeData[] }) {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-card p-2 md:pt-0 shadow-sm border border-border">
                    {/* Mobile View */}
                    <div className="md:hidden">
                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="mb-2 w-full rounded-md bg-background p-4 border border-input"
                            >
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <p className="font-medium text-lg">{employee.name}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {employee.employee?.maxHoursPerWeek} hrs/wk
                                        </p>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {employee.employee?.skills.map(skill => (
                                                <span key={skill} className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <DeleteEmployee id={employee.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View */}
                    <table className="hidden min-w-full text-foreground md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Max Hours
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Skills
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-background">
                            {employees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="w-full border-b border-border last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">
                                            <p className="font-medium">{employee.name}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {employee.email}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {employee.employee?.maxHoursPerWeek}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {employee.employee?.skills.map(skill => (
                                                <span key={skill} className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <Link
                                                href={`/dashboard/employees/${employee.id}/edit`}
                                                className="rounded-md border border-input p-2 hover:bg-muted"
                                            >
                                                <span className="sr-only">Edit</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </Link>
                                            <DeleteEmployee id={employee.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function DeleteEmployee({ id }: { id: string }) {
    const deleteEmployeeWithId = deleteEmployee.bind(null, id);

    return (
        <form action={async () => {
            'use server';
            await deleteEmployeeWithId();
        }}>
            <button className="rounded-md border border-input p-2 hover:bg-destructive hover:text-destructive-foreground">
                <span className="sr-only">Delete</span>
                Delete
            </button>
        </form>
    );
}
