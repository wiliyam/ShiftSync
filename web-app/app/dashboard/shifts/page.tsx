import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import ShiftList from '@/app/ui/shifts/shift-list';

const prisma = new PrismaClient();

export default async function Page() {
    const shifts = await prisma.shift.findMany({
        include: {
            employee: {
                include: {
                    user: { select: { name: true } }
                }
            },
            location: { select: { name: true } }
        },
        orderBy: {
            start: 'asc'
        }
    });

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl text-foreground font-bold">Shifts</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <div className="relative flex flex-1 flex-shrink-0">
                    {/* Search Input Placeholder */}
                </div>
                <Link
                    href="/dashboard/shifts/create"
                    className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <span className="hidden md:block">Create Shift</span>
                    <span className="md:hidden">+</span>
                </Link>
            </div>
            <ShiftList shifts={shifts} />
        </div>
    );
}
