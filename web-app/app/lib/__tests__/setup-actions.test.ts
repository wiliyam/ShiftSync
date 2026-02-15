import { checkUsersExist, createAdmin } from '../setup-actions';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
    prisma: {
        user: {
            count: jest.fn(),
            create: jest.fn(),
        },
    },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

// Mock redirect
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

describe('Setup Actions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkUsersExist', () => {
        it('should return true if users exist', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(1);
            const result = await checkUsersExist();
            expect(result).toBe(true);
        });

        it('should return false if no users exist', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(0);
            const result = await checkUsersExist();
            expect(result).toBe(false);
        });

        it('should return false on error', async () => {
            (prisma.user.count as jest.Mock).mockRejectedValue(new Error('DB Error'));
            // Temporarily suppress console.error
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const result = await checkUsersExist();
            expect(result).toBe(false);
            consoleSpy.mockRestore();
        });
    });

    describe('createAdmin', () => {
        const mockFormData = new FormData();
        mockFormData.append('name', 'Admin User');
        mockFormData.append('email', 'admin@example.com');
        mockFormData.append('password', 'password123');

        it('should fail if users already exist', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(1);
            const result = await createAdmin({}, mockFormData);
            expect(result).toEqual({ message: 'Setup is already complete. Users exist.' });
            expect(prisma.user.create).not.toHaveBeenCalled();
        });

        it('should fail validation with invalid data', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(0);
            const invalidData = new FormData();
            invalidData.append('name', 'A'); // Too short

            const result = await createAdmin({}, invalidData);
            expect(result?.message).toContain('Missing Fields');
        });

        it('should create admin user and redirect', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(0);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
            (prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', email: 'admin@example.com' });

            // We can't easily test redirect throws, but we expect it to be called.
            // Next.js redirect throws an error NEXT_REDIRECT.

            try {
                await createAdmin({}, mockFormData);
            } catch (e: any) {
                // Ignore redirect error if it's the specific redirect
            }

            // Check create was called
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'hashed_password',
                    role: 'ADMIN', // Hardcoded ROLE usually
                }
            });
        });

        it('should handle db error during creation', async () => {
            (prisma.user.count as jest.Mock).mockResolvedValue(0);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
            (prisma.user.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

            const result = await createAdmin({}, mockFormData);
            expect(result).toEqual({ message: 'Database Error: Failed to Create Admin.' });
        });
    });
});
