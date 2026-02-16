import { createEmployee, updateEmployee, deleteEmployee, fetchEmployees, fetchEmployeesPages, fetchActiveEmployees } from '@/app/lib/employee-actions';
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
            update: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
    },
}));

describe('Employee Actions', () => {
    // Mock transaction client - defined in outer scope but initialized in beforeEach
    let mockTx: any;

    beforeEach(() => {
        jest.resetAllMocks();

        // Initialize mockTx with fresh jest.fns
        mockTx = {
            user: {
                create: jest.fn(),
                update: jest.fn(),
                findUnique: jest.fn(),
            },
            employee: {
                create: jest.fn(),
                update: jest.fn(),
            },
        };

        // Setup default successful transaction mock
        (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
            return await callback(mockTx);
        });

        // Default mock behaviors
        mockTx.user.findUnique.mockResolvedValue(null);
        (prisma.user.delete as jest.Mock).mockResolvedValue({});
        (prisma.user.update as jest.Mock).mockResolvedValue({});
        (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.user.count as jest.Mock).mockResolvedValue(0);
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
            formData.append('password', 'password123');
            formData.append('maxHours', '40');
            formData.append('skills', 'React, Node');

            // Reset mocks for this test
            mockTx.user.create.mockResolvedValue({ id: 'user-1' });
            mockTx.employee.create.mockResolvedValue({ id: 'emp-1' });

            // We expect redirect, so we catch the "error" usually thrown by next/navigation
            try {
                await createEmployee({}, formData);
            } catch (e) {
                // Next.js redirect throws, we treat this as success here if it's the expected behavior
            }

            // Using check on call length as direct toHaveBeenCalled check was flaky in this environment
            expect(mockTx.user.create.mock.calls.length).toBeGreaterThan(0);
            expect(mockTx.employee.create).toHaveBeenCalled();
            expect(prisma.$transaction).toHaveBeenCalled();
        });

        it('handles database errors appropriately', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('password', 'password123');
            formData.append('maxHours', '40');
            formData.append('skills', 'React');

            (prisma.$transaction as jest.Mock).mockRejectedValue(new Error('Database Error'));

            const result = await createEmployee({}, formData);

            expect(result?.message).toContain('Database Error');
        });

        it('returns validation error when maxHours is 0', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('password', 'password123');
            formData.append('maxHours', '0');

            const result = await createEmployee({}, formData);

            expect(result).toHaveProperty('errors');
            expect(result.errors?.maxHours).toBeDefined();
        });

        it('returns validation error when maxHours exceeds 168', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('password', 'password123');
            formData.append('maxHours', '169');

            const result = await createEmployee({}, formData);

            expect(result).toHaveProperty('errors');
            expect(result.errors?.maxHours).toBeDefined();
            expect(result.errors?.maxHours?.[0]).toContain('168');
        });

        it('succeeds with maxHours at upper boundary (168)', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('password', 'password123');
            formData.append('maxHours', '168');

            mockTx.user.create.mockResolvedValue({ id: 'user-1' });
            mockTx.employee.create.mockResolvedValue({ id: 'emp-1' });

            try {
                await createEmployee({}, formData);
            } catch (e) {
                // redirect throws
            }

            expect(mockTx.user.create.mock.calls.length).toBeGreaterThan(0);
            expect(mockTx.employee.create).toHaveBeenCalled();
        });

        it('succeeds with maxHours at lower boundary (1)', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('password', 'password123');
            formData.append('maxHours', '1');

            mockTx.user.create.mockResolvedValue({ id: 'user-1' });
            mockTx.employee.create.mockResolvedValue({ id: 'emp-1' });

            try {
                await createEmployee({}, formData);
            } catch (e) {
                // redirect throws
            }

            expect(mockTx.user.create.mock.calls.length).toBeGreaterThan(0);
            expect(mockTx.employee.create).toHaveBeenCalled();
        });

        it('returns error when email already exists', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'existing@example.com');
            formData.append('password', 'password123');
            formData.append('maxHours', '40');

            mockTx.user.findUnique.mockResolvedValue({ id: 'existing-user', email: 'existing@example.com' });

            const result = await createEmployee({}, formData);

            expect(result?.message).toContain('email already exists');
        });

        it('returns validation error when email is missing', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('password', 'password123');
            formData.append('maxHours', '40');

            const result = await createEmployee({}, formData);

            expect(result).toHaveProperty('errors');
            expect(result.errors?.email).toBeDefined();
        });

        it('returns validation error when password is missing', async () => {
            const formData = new FormData();
            formData.append('name', 'John Doe');
            formData.append('email', 'john@example.com');
            formData.append('maxHours', '40');

            const result = await createEmployee({}, formData);

            expect(result).toHaveProperty('errors');
            expect(result.errors?.password).toBeDefined();
        });
    });

    describe('updateEmployee', () => {
        const validFormData = new FormData();
        validFormData.append('name', 'Jane Doe');
        validFormData.append('email', 'jane@example.com');
        validFormData.append('password', 'password123');
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

        it('updates user name and email in transaction', async () => {
            const formData = new FormData();
            formData.append('name', 'Updated Name');
            formData.append('email', 'updated@example.com');
            formData.append('maxHours', '35');
            formData.append('skills', 'React');

            try {
                await updateEmployee('user-1', {}, formData);
            } catch (e) {
                // redirect throws
            }

            expect(mockTx.user.update).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                data: expect.objectContaining({ name: 'Updated Name', email: 'updated@example.com' })
            });
        });

        it('updates skills via employee profile', async () => {
            const formData = new FormData();
            formData.append('name', 'Jane Doe');
            formData.append('email', 'jane@example.com');
            formData.append('maxHours', '40');
            formData.append('skills', 'React');

            try {
                await updateEmployee('user-1', {}, formData);
            } catch (e) {
                // redirect throws
            }

            expect(mockTx.employee.update).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                data: expect.objectContaining({ skills: ['React'] })
            });
        });

        it('parses comma-separated skills string into array', async () => {
            const formData = new FormData();
            formData.append('name', 'Jane Doe');
            formData.append('email', 'jane@example.com');
            formData.append('maxHours', '40');
            formData.append('skills', 'React, Node, TypeScript');

            try {
                await updateEmployee('user-1', {}, formData);
            } catch (e) {
                // redirect throws
            }

            expect(mockTx.employee.update).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                data: expect.objectContaining({ skills: ['React', 'Node', 'TypeScript'] })
            });
        });
    });

    describe('fetchEmployees', () => {
        it('returns employees from the database', async () => {
            const mockEmployees = [
                { id: 'u1', name: 'Alice', email: 'alice@test.com', employee: { maxHoursPerWeek: 40 } },
                { id: 'u2', name: 'Bob', email: 'bob@test.com', employee: { maxHoursPerWeek: 30 } },
            ];
            (prisma.user.findMany as jest.Mock).mockResolvedValue(mockEmployees);

            const result = await fetchEmployees('', 1);

            expect(result).toEqual(mockEmployees);
            expect(prisma.user.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    take: 10,
                    skip: 0,
                })
            );
        });

        it('applies pagination offset correctly', async () => {
            (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

            await fetchEmployees('', 3);

            expect(prisma.user.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    skip: 20,
                })
            );
        });

        it('throws error on database failure', async () => {
            (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await expect(fetchEmployees('', 1)).rejects.toThrow('Failed to fetch employees.');
        });
    });

    describe('fetchEmployeesPages', () => {
        it('returns correct number of pages', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(25);

            const result = await fetchEmployeesPages('');

            expect(result).toBe(3); // ceil(25/10)
        });

        it('returns 1 page when count is less than page size', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(5);

            const result = await fetchEmployeesPages('');

            expect(result).toBe(1);
        });

        it('throws error on database failure', async () => {
            (prisma.user.count as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await expect(fetchEmployeesPages('')).rejects.toThrow('Failed to fetch total number of employees.');
        });
    });

    describe('fetchActiveEmployees', () => {
        it('returns active employees', async () => {
            const mockEmployees = [
                { id: 'u1', name: 'Alice', employee: { id: 'e1' } },
            ];
            (prisma.user.findMany as jest.Mock).mockResolvedValue(mockEmployees);

            const result = await fetchActiveEmployees();

            expect(result).toEqual(mockEmployees);
            expect(prisma.user.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        employee: { isNot: null },
                    }),
                })
            );
        });

        it('throws error on database failure', async () => {
            (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await expect(fetchActiveEmployees()).rejects.toThrow('Failed to fetch active employees.');
        });
    });

    describe('deleteEmployee', () => {
        it('successfully deletes an employee', async () => {
            // Explicitly reset implementation for this test to ensure no contamination
            (prisma.user.delete as jest.Mock).mockResolvedValue({});

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

        it('calls revalidatePath on success', async () => {
            const { revalidatePath } = require('next/cache');
            (prisma.user.delete as jest.Mock).mockResolvedValue({});

            await deleteEmployee('user-1');

            expect(revalidatePath).toHaveBeenCalledWith('/admin/employees');
        });
    });
});
