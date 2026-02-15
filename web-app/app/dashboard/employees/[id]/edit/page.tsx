import EditEmployeeForm from '@/app/ui/employees/edit-form';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

async function fetchEmployeeById(id: string) {
    try {
        const employee = await prisma.user.findUnique({
            where: { id },
            include: { employee: true }
        });
        return employee;
    } catch (error) {
        return null;
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const employee = await fetchEmployeeById(id);

    if (!employee) {
        notFound();
    }

    return (
        <main>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Edit Employee</h1>
            </div>
            <EditEmployeeForm employee={employee} />
        </main>
    );
}
