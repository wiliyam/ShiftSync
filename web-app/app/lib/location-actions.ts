'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const CreateLocationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    address: z.string().optional(),
});

export async function fetchLocations() {
    try {
        const locations = await prisma.location.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { shifts: true },
                },
            },
        });
        return locations;
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        throw new Error('Failed to fetch locations.');
    }
}

export async function createLocation(prevState: string | undefined, formData: FormData) {
    const validatedFields = CreateLocationSchema.safeParse({
        name: formData.get('name'),
        address: formData.get('address'),
    });

    if (!validatedFields.success) {
        return 'Validation Error: Check your input.';
    }

    const { name, address } = validatedFields.data;

    try {
        await prisma.location.create({
            data: {
                name,
                address,
            },
        });
    } catch (error) {
        console.error('Failed to create location:', error);
        return 'Failed to create location.';
    }

    revalidatePath('/admin/locations');
    redirect('/admin/locations');
}

export async function deleteLocation(id: string) {
    try {
        await prisma.location.delete({
            where: { id },
        });
        revalidatePath('/admin/locations');
    } catch (error) {
        console.error('Failed to delete location:', error);
        throw new Error('Failed to delete location.');
    }
}
