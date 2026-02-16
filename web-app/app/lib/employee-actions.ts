'use server';

import { prisma } from '@/app/lib/prisma';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

export async function fetchEmployees(
    query: string,
    currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const employees = await prisma.user.findMany({
            where: {
                role: Role.EMPLOYEE,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
            include: {
                employee: true,
            },
            orderBy: {
                name: 'asc',
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
        });

        return employees;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch employees.');
    }
}

export async function fetchEmployeesPages(query: string) {
    try {
        const count = await prisma.user.count({
            where: {
                role: Role.EMPLOYEE,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ],
            },
        });
        return Math.ceil(count / ITEMS_PER_PAGE);
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of employees.');
    }
}

export async function fetchActiveEmployees() {
    try {
        const employees = await prisma.user.findMany({
            where: {
                role: Role.EMPLOYEE,
                employee: {
                    isNot: null
                }
            },
            include: {
                employee: true,
            },
            orderBy: {
                name: 'asc'
            }
        });
        return employees;
    } catch (error) {
        console.error('Failed to fetch active employees:', error);
        throw new Error('Failed to fetch active employees.');
    }
}

const CreateEmployeeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    maxHours: z.coerce.number().min(1, 'Max hours must be at least 1').max(168, 'Max hours cannot exceed 168 (hours in a week)'),
});

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        maxHours?: string[];
    };
    message?: string | null;
};

export async function createEmployee(prevState: State | undefined, formData: FormData) {
    const validatedFields = CreateEmployeeSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        maxHours: formData.get('maxHours'),
    });

    if (!validatedFields.success) {
        console.log('Validation Failed:', validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Employee.',
        };
    }

    const { name, email, password, maxHours } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.$transaction(async (tx) => {
            // Check if user exists
            const existingUser = await tx.user.findUnique({ where: { email } });

            if (existingUser) {
                throw new Error('User with this email already exists.');
            }

            // Create User
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: Role.EMPLOYEE,
                },
            });

            // Create Employee Profile
            await tx.employee.create({
                data: {
                    userId: newUser.id,
                    maxHoursPerWeek: maxHours,
                    skills: [], // Initialize with empty skills
                },
            });
        });
    } catch (error) {
        console.error('Failed to create employee:', error);
        return {
            message: error instanceof Error ? error.message : 'Database Error: Failed to Create Employee.',
        };
    }

    revalidatePath('/admin/employees');
    redirect('/admin/employees');
}

const UpdateEmployeeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    maxHours: z.coerce.number().min(1, 'Max hours must be at least 1').max(168, 'Max hours cannot exceed 168 (hours in a week)').optional(),
    skills: z.string().optional(), // Comma separated string for simplicity in form
});

export async function updateEmployee(id: string, prevState: State | undefined, formData: FormData) {
    const validatedFields = UpdateEmployeeSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        maxHours: formData.get('maxHours'),
        skills: formData.get('skills'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Employee.',
        };
    }

    const { name, email, maxHours, skills } = validatedFields.data;
    const skillsArray = skills ? skills.split(',').map(s => s.trim()) : undefined;

    try {
        await prisma.$transaction(async (tx) => {
            // Update User
            if (name || email) {
                await tx.user.update({
                    where: { id },
                    data: { name, email }
                });
            }

            // Update Employee Profile
            if (maxHours !== undefined || skillsArray !== undefined) {
                await tx.employee.update({
                    where: { userId: id },
                    data: {
                        maxHoursPerWeek: maxHours,
                        skills: skillsArray
                    }
                });
            }
        });
    } catch (error) {
        console.error('Failed to update employee:', error);
        return {
            message: 'Database Error: Failed to Update Employee.',
        };
    }

    revalidatePath('/admin/employees');
    redirect('/admin/employees');
}

export async function deleteEmployee(id: string) {
    try {
        await prisma.user.delete({
            where: { id }
        });
        revalidatePath('/admin/employees');
    } catch (error) {
        console.error('Failed to delete employee:', error);
        return {
            message: 'Database Error: Failed to Delete Employee.',
        };
    }
}
