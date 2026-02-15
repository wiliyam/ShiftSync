'use server';

import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import { Role, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

// Removed direct instantiation
// const prisma = new PrismaClient();

const FormSchema = z.object({
    id: z.string(),
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email(),
    maxHours: z.coerce.number().gt(0, { message: 'Max hours must be greater than 0.' }),
    skills: z.string(), // Comma separated for simplicity in MVP
});

const CreateEmployee = FormSchema.omit({ id: true });

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        maxHours?: string[];
        skills?: string[];
    };
    message?: string | null;
};

export async function createEmployee(prevState: State, formData: FormData) {
    const validatedFields = CreateEmployee.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        maxHours: formData.get('maxHours'),
        skills: formData.get('skills'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Employee.',
        };
    }

    const { name, email, maxHours, skills } = validatedFields.data;
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);

    try {
        // 1. Create User (Auth)
        const hashedPassword = await bcrypt.hash('password123', 10); // Default password

        // Use transaction to ensure both or neither
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: Role.EMPLOYEE,
                }
            });

            // 2. Create Employee Profile
            await tx.employee.create({
                data: {
                    userId: user.id,
                    maxHoursPerWeek: maxHours,
                    skills: skillsArray
                }
            });
        });

    } catch (error) {
        console.error(error);
        return {
            message: 'Database Error: Failed to Create Employee (Email might be in use).',
        };
    }

    revalidatePath('/dashboard/employees');
    redirect('/dashboard/employees');
}

const UpdateEmployee = FormSchema.omit({ id: true });

export async function updateEmployee(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateEmployee.safeParse({
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
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);

    try {
        // Use transaction to ensure both or neither
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            await tx.user.update({
                where: { id },
                data: { name, email }
            });

            await tx.employee.update({
                where: { userId: id },
                data: {
                    maxHoursPerWeek: maxHours,
                    skills: skillsArray
                }
            });
        });
    } catch (error) {
        return { message: 'Database Error: Failed to Update Employee.' };
    }

    revalidatePath('/dashboard/employees');
    redirect('/dashboard/employees');
}

export async function deleteEmployee(id: string) {
    try {
        // Deleting user cascades to employee
        await prisma.user.delete({ where: { id } });
        revalidatePath('/dashboard/employees');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Employee.' };
    }
}
