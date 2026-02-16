import { fetchShifts } from '@/app/lib/shift-actions';
import WeekView from '@/app/ui/admin/shifts/week-view';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ShiftsPage({
    searchParams,
}: {
    searchParams?: {
        date?: string;
    };
}) {
    const today = new Date();
    let queryDate = today;
    if (searchParams?.date) {
        const [year, month, day] = searchParams.date.split('-').map(Number);
        queryDate = new Date(year, month - 1, day);
    }

    const dayOfWeek = queryDate.getDay();
    const weekStart = new Date(queryDate);
    weekStart.setDate(queryDate.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const shifts = await fetchShifts(weekStart, weekEnd);

    const prevWeek = new Date(weekStart);
    prevWeek.setDate(prevWeek.getDate() - 7);

    const nextWeek = new Date(weekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="w-full flex flex-col h-[calc(100vh-100px)]">
            <div className="flex w-full items-center justify-between mb-4 flex-shrink-0">
                <h1 className="text-2xl font-bold font-outfit">Shift Schedule</h1>

                <div className="flex items-center space-x-1 bg-card border border-border rounded-lg p-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/shifts?date=${formatDate(prevWeek)}`}>
                            <ChevronLeft className="w-4 h-4" />
                            Prev
                        </Link>
                    </Button>
                    <span className="font-medium text-sm w-36 text-center">
                        {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/shifts?date=${formatDate(nextWeek)}`}>
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <Button asChild>
                    <Link href="/admin/shifts/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Shift
                    </Link>
                </Button>
            </div>

            <WeekView shifts={shifts} currentDate={queryDate} />
        </div>
    );
}
