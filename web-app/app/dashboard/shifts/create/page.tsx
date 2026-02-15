import CreateShiftForm from '@/app/ui/shifts/create-form';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Page() {
    const employees = await prisma.user.findMany({
        where: { role: Role.EMPLOYEE },
        select: { id: true, name: true }
    });

    const locations = await prisma.location.findMany();

    return (
        <main>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Create Shift</h1>
            </div>
            <CreateShiftForm employees={employees} locations={locations} />
        </main>
    );
}
