import CreateEmployeeForm from '@/app/ui/admin/employees/create-form';

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-outfit">Add New Employee</h1>
            </div>
            <CreateEmployeeForm />
        </div>
    );
}
