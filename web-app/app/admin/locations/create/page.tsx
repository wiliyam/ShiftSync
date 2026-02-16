import CreateLocationForm from '@/app/ui/admin/locations/create-form';

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-outfit">Add New Location</h1>
            </div>
            <CreateLocationForm />
        </div>
    );
}
