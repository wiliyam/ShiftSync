import { fetchShifts } from '@/app/lib/shift-actions';
import WeekView from '@/app/ui/admin/shifts/week-view';
import Link from 'next/link';

export default async function ShiftsPage({
    searchParams,
}: {
    searchParams?: {
        date?: string; // YYYY-MM-DD
    };
}) {
    const today = new Date();
    // Parse query date or default to today
    // We assume the date string is YYYY-MM-DD
    let queryDate = today;
    if (searchParams?.date) {
        const [year, month, day] = searchParams.date.split('-').map(Number);
        queryDate = new Date(year, month - 1, day);
    }

    // Calculate week start (Sunday)
    const dayOfWeek = queryDate.getDay();
    const weekStart = new Date(queryDate);
    weekStart.setDate(queryDate.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const shifts = await fetchShifts(weekStart, weekEnd);

    // Navigation
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

                <div className="flex items-center space-x-4 bg-card border border-border rounded-lg p-1">
                    <Link href={`/admin/shifts?date=${formatDate(prevWeek)}`} className="p-2 hover:bg-secondary rounded-md text-sm font-medium">
                        &larr; Prev
                    </Link>
                    <span className="font-medium text-sm w-36 text-center">
                        {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <Link href={`/admin/shifts?date=${formatDate(nextWeek)}`} className="p-2 hover:bg-secondary rounded-md text-sm font-medium">
                        Next &rarr;
                    </Link>
                </div>

                <Link href="/admin/shifts/create" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                    + Add Shift
                </Link>
            </div>

            <WeekView shifts={shifts} currentDate={queryDate} />
        </div>
    );
}
