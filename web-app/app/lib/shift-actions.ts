'use server';

import { prisma } from '@/app/lib/prisma';
import { ShiftStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const CreateShiftSchema = z.object({
    locationId: z.string().min(1, 'Location is required'),
    start: z.string(), // Accept datetime-local string
    end: z.string(),
    employeeId: z.string().optional(),
}).refine(data => new Date(data.end) > new Date(data.start), {
    message: "End time must be after start time",
    path: ["end"]
});

export async function fetchShifts(start: Date, end: Date) {
    try {
        const shifts = await prisma.shift.findMany({
            where: {
                start: {
                    gte: start,
                },
                end: {
                    lte: end,
                }
            },
            include: {
                location: true,
                employee: {
                    include: { user: true }
                }
            },
            orderBy: {
                start: 'asc',
            }
        });
        return shifts;
    } catch (error) {
        console.error('Failed to fetch shifts:', error);
        throw new Error('Failed to fetch shifts.');
    }
}

export async function createShift(prevState: string | undefined, formData: FormData) {
    // We expect the form to provide ISO-like strings from datetime-local
    const validatedFields = CreateShiftSchema.safeParse({
        locationId: formData.get('locationId'),
        start: formData.get('start'),
        end: formData.get('end'),
        employeeId: formData.get('employeeId') || undefined,
    });

    if (!validatedFields.success) {
        return 'Validation Error: ' + validatedFields.error.errors.map(e => e.message).join(', ');
    }

    const { locationId, start, end, employeeId } = validatedFields.data;

    try {
        await prisma.shift.create({
            data: {
                locationId,
                start: new Date(start), // JS Date constructor handles YYYY-MM-DDTHH:mm correctly (local time)
                end: new Date(end),
                employeeId,
                status: ShiftStatus.DRAFT,
            },
        });
    } catch (error) {
        console.error('Failed to create shift:', error);
        if (error instanceof Error) {
            return `Failed to create shift: ${error.message}`;
        }
        return 'Failed to create shift.';
    }

    revalidatePath('/admin/shifts');
    redirect('/admin/shifts');
}

export async function deleteShift(id: string) {
    try {
        await prisma.shift.delete({ where: { id } });
        revalidatePath('/admin/shifts');
    } catch (error) {
        console.error('Error deleting shift:', error);
        throw new Error('Failed to delete shift');
    }
}
