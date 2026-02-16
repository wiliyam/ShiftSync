import { fetchDashboardStats } from '@/app/lib/dashboard-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPage() {
    const { employeeCount, locationCount, shiftCount } = await fetchDashboardStats();

    const stats = [
        { label: 'Total Employees', value: employeeCount, icon: Users, color: 'bg-indigo-100 text-primary dark:bg-indigo-900/30' },
        { label: 'Active Shifts', value: shiftCount, icon: Calendar, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
        { label: 'Locations', value: locationCount, icon: MapPin, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    ];

    const quickActions = [
        { label: 'Add Employee', href: '/admin/employees/create', icon: Users },
        { label: 'Add Location', href: '/admin/locations/create', icon: MapPin },
        { label: 'Create Schedule', href: '/admin/shifts/create', icon: Calendar },
    ];

    return (
        <main>
            <h1 className="mb-8 text-2xl font-bold font-outfit text-foreground">
                Dashboard Overview
            </h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="flex items-center space-x-4 p-6">
                            <div className={`p-3 rounded-full ${stat.color}`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold font-outfit mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {quickActions.map((action) => (
                        <Button
                            key={action.label}
                            variant="secondary"
                            size="lg"
                            className="h-auto py-4 justify-center"
                            asChild
                        >
                            <Link href={action.href}>
                                <Plus className="w-4 h-4 mr-2" />
                                {action.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </main>
    );
}
