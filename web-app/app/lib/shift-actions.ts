'use server';

import { z } from 'zod';
import { PrismaClient, ShiftStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const FormSchema = z.object({
    id: z.string(),
    employeeId: z.string().min(1, { message: 'Please select an employee.' }),
    locationId: z.string().min(1, { message: 'Please select a location.' }),
    start: z.string().datetime(), // ISO string from form
    end: z.string().datetime(),
});

const CreateShift = FormSchema.omit({ id: true });

export type State = {
    errors?: {
        employeeId?: string[];
        locationId?: string[];
        start?: string[];
        end?: string[];
    };
    message?: string | null;
};

export async function createShift(prevState: State, formData: FormData) {
    // Convert datetime-local input (YYYY-MM-DDTHH:mm) to ISO
    const startInput = formData.get('start') as string;
    const endInput = formData.get('end') as string;

    // Simple ISO conversion (adding :00Z or similar if needed, usually Date constructor handles it)
    const startDate = new Date(startInput);
    const endDate = new Date(endInput);

    // Validate dates logically
    if (startDate >= endDate) {
        return {
            message: 'Start time must be before end time.',
            errors: {},
        };
    }

    const validatedFields = CreateShift.safeParse({
        employeeId: formData.get('employeeId'),
        locationId: formData.get('locationId'),
        start: startDate.toISOString(),
        end: endDate.toISOString(),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Shift.',
        };
    }

    const { employeeId, locationId, start, end } = validatedFields.data;

    // Conflict Check
    const hasConflict = await prisma.shift.findFirst({
        where: {
            employeeId,
            OR: [
                {
                    start: { lte: start },
                    end: { gt: start }
                },
                {
                    start: { lt: end },
                    end: { gte: end }
                },
                {
                    start: { gte: start },
                    end: { lte: end }
                }
            ]
        }
    });

    if (hasConflict) {
        return {
            message: 'Conflict: Employee already has a shift during this time.',
            errors: {}
        };
    }

    try {
        await prisma.shift.create({
            data: {
                employeeId,
                locationId,
                start,
                end,
                status: ShiftStatus.DRAFT,
                requiredSkills: [] // Todo: infer from role or manual input
            },
        });
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Shift.',
        };
    }

    revalidatePath('/dashboard/shifts');
    redirect('/dashboard/shifts');
}

export async function deleteShift(id: string) {
    try {
        await prisma.shift.delete({ where: { id } });
        revalidatePath('/dashboard/shifts');
    } catch (error) {
        return { message: 'Database Error: Failed to Delete Shift.' };
    }
}
