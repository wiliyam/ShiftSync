import { createEmployee, updateEmployee, deleteEmployee } from '@/app/lib/employee-actions';
import { prisma } from '@/app/lib/prisma';

// Mock bcrypt and next actions
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

// Mock Prisma
jest.mock('@/app/lib/prisma', () => ({
    prisma: {
        $transaction: jest.fn(),
        user: {
            delete: jest.fn(),
        },
    },
}));

describe('Employee Actions', () => {
    // Mock transaction client
    const mockTx = {
        user: {
            create: jest.fn(),
            update: jest.fn(),
        },
        employee: {
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default successful transaction mock
        (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
            return await callback(mockTx);
        });
    });

    describe('createEmployee', () => {
        it('returns errors for invalid input', async () => {
            const formData = new FormData();
            formData.append('name', ''); // Invalid
            // Missing other fields

            const result = await createEmployee({}, formData);

            expect(result).toHaveProperty('errors');
            expect(result.errors?.name).toBeDefined();
        });

        it('successfully creates an employee', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('maxHours', '40');
            formData.append('skills', 'React, Node');

            mockTx.user.create.mockResolvedValue({ id: 'user-1' });
            mockTx.employee.create.mockResolvedValue({ id: 'emp-1' });

            // We expect redirect, so we catch the "error" usually thrown by next/navigation
            try {
                await createEmployee({}, formData);
            } catch (e) {
                // Next.js redirect throws, we treat this as success here if it's the expected behavior
            }

            expect(mockTx.user.create).toHaveBeenCalled();
            expect(mockTx.employee.create).toHaveBeenCalled();
            expect(prisma.$transaction).toHaveBeenCalled();
        });

        it('handles database errors appropriately', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('maxHours', '40');
            formData.append('skills', 'React');

            (prisma.$transaction as jest.Mock).mockRejectedValue(new Error('DB Error'));

            const result = await createEmployee({}, formData);

            expect(result?.message).toContain('Database Error');
        });
    });

    describe('updateEmployee', () => {
        const validFormData = new FormData();
        validFormData.append('name', 'Jane Doe');
        validFormData.append('email', 'jane@example.com');
        validFormData.append('maxHours', '30');
        validFormData.append('skills', 'Vue');

        it('returns errors for invalid input', async () => {
            const formData = new FormData();
            formData.append('email', 'not-an-email');

            const result = await updateEmployee('id-1', {}, formData);
            expect(result.errors?.email).toBeDefined();
        });

        it('successfully updates an employee', async () => {
            try {
                await updateEmployee('user-1', {}, validFormData);
            } catch (e) {
                // Ignore redirect
            }

            expect(mockTx.user.update).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                data: expect.objectContaining({ name: 'Jane Doe' })
            });
            expect(mockTx.employee.update).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                data: expect.objectContaining({ maxHoursPerWeek: 30 })
            });
        });

        it('handles database errors', async () => {
            (prisma.$transaction as jest.Mock).mockRejectedValue(new Error('DB Fail'));
            const result = await updateEmployee('user-1', {}, validFormData);
            expect(result?.message).toContain('Database Error');
        });
    });

    describe('deleteEmployee', () => {
        it('successfully deletes an employee', async () => {
            await deleteEmployee('user-1');
            expect(prisma.user.delete).toHaveBeenCalledWith({
                where: { id: 'user-1' }
            });
        });

        it('handles database errors', async () => {
            (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('Delete Fail'));
            const result = await deleteEmployee('user-1');
            expect(result?.message).toContain('Database Error');
        });
    });
});
