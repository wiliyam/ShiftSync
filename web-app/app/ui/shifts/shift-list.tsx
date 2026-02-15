import { deleteShift } from '@/app/lib/shift-actions';

// Type definition
type ShiftData = {
    id: string;
    start: Date;
    end: Date;
    employee: {
        user: { name: string | null }
    } | null;
    location: { name: string };
    status: string;
};

export default function ShiftList({ shifts }: { shifts: ShiftData[] }) {
    if (shifts.length === 0) {
        return <p className="mt-4 text-muted-foreground">No upcoming shifts scheduled.</p>;
    }

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-card p-2 md:pt-0 shadow-sm border border-border">
                    <table className="min-w-full text-foreground">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Date
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Time
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Employee
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Location
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-background">
                            {shifts.map((shift) => (
                                <tr
                                    key={shift.id}
                                    className="w-full border-b border-border last-of-type:border-none"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3 font-medium">
                                        {shift.start.toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {shift.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {shift.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {shift.employee?.user.name || <span className="text-muted-foreground italic">Unassigned</span>}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                            {shift.location.name}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <DeleteShift id={shift.id} />
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

function DeleteShift({ id }: { id: string }) {
    const deleteShiftWithId = deleteShift.bind(null, id);

    return (
        <form action={async () => {
            'use server';
            await deleteShiftWithId();
        }}>
            <button className="rounded-md border border-input p-2 hover:bg-destructive hover:text-destructive-foreground">
                <span className="sr-only">Delete</span>
                Delete
            </button>
        </form>
    );
}
