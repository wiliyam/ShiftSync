'use client';

import { format, addDays, startOfWeek, isSameDay, getDay, getHours, getMinutes, differenceInMinutes, parseISO } from 'date-fns';
import clsx from 'clsx';
import Link from 'next/link';

interface Shift {
    id: string;
    start: Date | string;
    end: Date | string;
    location: { name: string };
    employee: { user: { name: string | null } } | null;
}

export default function WeekView({
    shifts,
    currentDate
}: {
    shifts: Shift[],
    currentDate: Date
}) {
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
    const days = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    // Filter shifts for the current week to avoid processing unrelated data
    const weekShifts = shifts.filter(shift => {
        const shiftStart = new Date(shift.start);
        return shiftStart >= startOfCurrentWeek && shiftStart < addDays(startOfCurrentWeek, 7);
    });

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] border border-border rounded-lg bg-card overflow-hidden">
            {/* Header: Days */}
            <div className="flex border-b border-border bg-secondary/50">
                <div className="w-16 flex-shrink-0 border-r border-border" /> {/* Time column header placeholder */}
                <div className="flex-1 grid grid-cols-7 divide-x divide-border">
                    {days.map((day) => (
                        <div key={day.toString()} className={clsx("p-2 text-center", isSameDay(day, new Date()) && "bg-indigo-50 dark:bg-indigo-900/20")}>
                            <div className="text-xs text-muted-foreground font-medium uppercase">{format(day, 'EEE')}</div>
                            <div className={clsx("text-xl font-bold font-outfit mt-1", isSameDay(day, new Date()) && "text-primary")}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Body: Time Grid */}
            <div className="flex-1 overflow-y-auto relative bg-background scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted">
                <div className="flex min-h-[1440px]"> {/* 24 hours * 60px/hr */}
                    {/* Time Labels */}
                    <div className="w-16 flex-shrink-0 border-r border-border bg-secondary/10 text-xs text-muted-foreground font-medium sticky left-0 z-30">
                        {hours.map((hour) => (
                            <div key={hour} className="h-[60px] border-b border-border/50 text-right pr-2 pt-2 relative">
                                <span className="-top-3 relative">{format(new Date().setHours(hour, 0, 0, 0), 'ha')}</span>
                            </div>
                        ))}
                    </div>

                    {/* Day Columns */}
                    <div className="flex-1 grid grid-cols-7 divide-x divide-border relative">
                        {days.map((day, dayIndex) => (
                            <div key={day.toString()} className="relative group">
                                {/* Hour Grid Lines */}
                                {hours.map((hour) => (
                                    <div key={hour} className="h-[60px] border-b border-border/50 group-hover:bg-secondary/20 transition-colors" />
                                ))}

                                {/* Click to Create Overlay (Invisible link covering the column) */}
                                <Link
                                    href={`/admin/shifts/create?date=${format(day, 'yyyy-MM-dd')}`}
                                    className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none"
                                >
                                    {/* Tooltip or icon potentially */}
                                </Link>

                                {/* Shifts */}
                                {weekShifts
                                    .filter(shift => isSameDay(new Date(shift.start), day))
                                    .map(shift => {
                                        const startTime = new Date(shift.start);
                                        const endTime = new Date(shift.end);
                                        const startMinutes = getHours(startTime) * 60 + getMinutes(startTime);
                                        const duration = differenceInMinutes(endTime, startTime);

                                        return (
                                            <div
                                                key={shift.id}
                                                className="absolute left-1 right-1 rounded-md border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/50 dark:border-indigo-800 p-1 text-xs hover:z-50 hover:shadow-lg transition-all cursor-pointer overflow-hidden z-20 group/shift"
                                                style={{
                                                    top: `${startMinutes}px`, // 1px per minute scale
                                                    height: `${duration}px`
                                                }}
                                            >
                                                <div className="font-semibold text-primary truncate">
                                                    {shift.employee?.user.name || 'Unassigned'}
                                                </div>
                                                <div className="text-indigo-600/80 dark:text-indigo-300 truncate text-[10px]">
                                                    {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                                                </div>
                                                <div className="text-muted-foreground truncate text-[10px] mt-0.5">
                                                    📍 {shift.location.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}

                        {/* Current Time Indicator (if current week) */}
                        {days.some(d => isSameDay(d, new Date())) && (
                            <div
                                className="absolute pointer-events-none border-t-2 border-red-500 w-full z-40 flex items-center"
                                style={{
                                    top: `${getHours(new Date()) * 60 + getMinutes(new Date())}px`
                                }}
                            >
                                <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
