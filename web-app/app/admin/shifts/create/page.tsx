import CreateShiftForm from '@/app/ui/admin/shifts/create-form';
import { fetchLocations } from '@/app/lib/location-actions';
import { fetchActiveEmployees } from '@/app/lib/employee-actions';

export default async function Page() {
    const locations = await fetchLocations();
    const employees = await fetchActiveEmployees();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-outfit">Create New Shift</h1>
            </div>
            <CreateShiftForm locations={locations} employees={employees} />
        </div>
    );
}
