import { fetchDashboardStats } from '@/app/lib/dashboard-actions';
import { UsersIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function AdminPage() {
    const { employeeCount, locationCount, shiftCount } = await fetchDashboardStats();

    return (
        <main>
            <h1 className="mb-8 text-2xl font-bold font-outfit text-foreground">
                Dashboard Overview
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-card p-6 shadow-sm border border-border flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 text-primary rounded-full">
                        <UsersIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                        <h3 className="text-2xl font-bold">{employeeCount}</h3>
                    </div>
                </div>

                <div className="rounded-xl bg-card p-6 shadow-sm border border-border flex items-center space-x-4">
                    <div className="p-3 bg-violet-100 text-violet-600 rounded-full">
                        <CalendarIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Shifts</p>
                        <h3 className="text-2xl font-bold">{shiftCount}</h3>
                    </div>
                </div>

                <div className="rounded-xl bg-card p-6 shadow-sm border border-border flex items-center space-x-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                        <MapPinIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Locations</p>
                        <h3 className="text-2xl font-bold">{locationCount}</h3>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold font-outfit mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/admin/employees/create" className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border text-center font-medium">
                        + Add Employee
                    </Link>
                    <Link href="/admin/locations" className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border text-center font-medium">
                        + Add Location
                    </Link>
                    <Link href="/admin/shifts" className="p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border text-center font-medium">
                        + Create Schedule
                    </Link>
                </div>
            </div>
        </main>
    );
}
