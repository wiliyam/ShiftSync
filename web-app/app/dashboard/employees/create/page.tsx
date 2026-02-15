import CreateEmployeeForm from '@/app/ui/employees/create-form';
import Link from 'next/link';

export default function Page() {
    return (
        <main>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Create Employee</h1>
            </div>
            <CreateEmployeeForm />
        </main>
    );
}
