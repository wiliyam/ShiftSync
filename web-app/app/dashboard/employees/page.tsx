import Link from 'next/link';
import { PrismaClient, Role } from '@prisma/client';
import EmployeeTable from '@/app/ui/employees/employee-table';

const prisma = new PrismaClient();

async function fetchEmployees() {
    // In a real app we'd use a shared prisma instance
    const employees = await prisma.user.findMany({
        where: {
            role: Role.EMPLOYEE // Only fetch employees, not admins
        },
        include: {
            employee: true
        },
        orderBy: {
            name: 'asc'
        }
    });
    return employees;
}

export default async function Page() {
    const employees = await fetchEmployees();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl text-foreground font-bold">Employees</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <div className="relative flex flex-1 flex-shrink-0">
                    {/* Search Input Placeholder */}
                    <input
                        className="peer block w-full rounded-md border border-input py-[9px] pl-10 text-sm outline-2 placeholder:text-muted-foreground"
                        placeholder="Search employees..."
                    />
                </div>
                <Link
                    href="/dashboard/employees/create"
                    className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <span className="hidden md:block">Create Employee</span>
                    <span className="md:hidden">+</span>
                </Link>
            </div>
            <EmployeeTable employees={employees} />
        </div>
    );
}
