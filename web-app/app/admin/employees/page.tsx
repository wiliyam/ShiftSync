import { fetchEmployees } from '@/app/lib/employee-actions';
import Link from 'next/link';

export default async function EmployeesPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const employees = await fetchEmployees(query, currentPage);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold font-outfit">Employees</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <input
                    type="text"
                    placeholder="Search employees..."
                    className="p-2 border rounded-md"
                />
                <Link
                    href="/admin/employees/create"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 text-sm font-medium transition-colors"
                >
                    Add Employee
                </Link>
            </div>
            <div className="mt-6 flow-root">
                <div className="inline-block min-w-full align-middle">
                    <div className="rounded-lg bg-card p-2 md:pt-0 shadow-sm border border-border">
                        {/* Mobile card view */}
                        <div className="md:hidden">
                            {employees?.length === 0 && (
                                <p className="p-4 text-center text-muted-foreground text-sm">No employees found.</p>
                            )}
                            {employees?.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="mb-2 w-full rounded-md bg-background p-4 border border-border"
                                >
                                    <div className="flex items-center justify-between border-b border-border pb-3">
                                        <div>
                                            <p className="font-semibold text-foreground">{employee.name}</p>
                                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3">
                                        <p className="text-sm text-muted-foreground">
                                            {employee.employee?.maxHoursPerWeek || 'N/A'} hrs/week
                                        </p>
                                        <div className="flex gap-2">
                                            <button className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table view */}
                        <table className="hidden min-w-full text-gray-900 md:table">
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
                                    <th scope="col" className="relative py-3 pl-6 pr-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900">
                                {employees?.map((employee) => (
                                    <tr key={employee.id} className="w-full border-b py-3 text-sm last-of-type:border-none border-gray-100 dark:border-zinc-800">
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex items-center gap-3">
                                                <p className="font-semibold text-foreground">{employee.name}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                                            {employee.email}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                                            {employee.employee?.maxHoursPerWeek || 'N/A'} hrs/week
                                        </td>
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify-end gap-3">
                                                <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
