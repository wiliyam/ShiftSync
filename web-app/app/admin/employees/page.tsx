import { fetchEmployees } from '@/app/lib/employee-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Plus, Pencil } from 'lucide-react';
import Link from 'next/link';

export default async function EmployeesPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const employees = await fetchEmployees(query, currentPage);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold font-outfit">Employees</h1>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Input
                    type="text"
                    placeholder="Search employees..."
                    className="max-w-sm"
                />
                <Button asChild>
                    <Link href="/admin/employees/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </Link>
                </Button>
            </div>

            <div className="mt-6">
                {/* Mobile card view */}
                <div className="space-y-3 md:hidden">
                    {employees?.length === 0 && (
                        <p className="p-4 text-center text-muted-foreground text-sm">No employees found.</p>
                    )}
                    {employees?.map((employee) => (
                        <Card key={employee.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <div>
                                        <p className="font-semibold text-foreground">{employee.name}</p>
                                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3">
                                    <Badge variant="secondary">
                                        {employee.employee?.maxHoursPerWeek || 'N/A'} hrs/week
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                        <Pencil className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Desktop table view */}
                <Card className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Max Hours</TableHead>
                                <TableHead className="text-right pr-6">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {employees?.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="pl-6 font-semibold">{employee.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {employee.employee?.maxHoursPerWeek || 'N/A'} hrs/week
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button variant="ghost" size="sm">
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
