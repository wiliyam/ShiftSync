'use server';

import { prisma } from '@/app/lib/prisma';
import { Role } from '@prisma/client';

export async function fetchDashboardStats() {
    try {
        const [employeeCount, locationCount, shiftCount] = await Promise.all([
            prisma.user.count({
                where: { role: Role.EMPLOYEE },
            }),
            prisma.location.count(),
            prisma.shift.count({
                where: {
                    status: {
                        not: 'COMPLETED'
                    }
                }
            }),
        ]);

        return {
            employeeCount,
            locationCount,
            shiftCount,
        };
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        throw new Error('Failed to fetch dashboard statistics.');
    }
}
