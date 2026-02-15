import { createEmployee } from '@/app/lib/employee-actions';
import prisma from '../../__mocks__/prisma';

// Mock bcrypt and next/cache
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

describe('createEmployee', () => {
    it('returns errors for invalid input', async () => {
        const formData = new FormData();
        // Missing fields
        formData.append('name', '');

        const result = await createEmployee({}, formData);

        expect(result).toHaveProperty('errors');
        // We expect errors.name to exist because name is empty string (min 2 chars)
        expect(result.errors?.name).toBeDefined();
    });

    // Note: Testing successful creation involves mocking the transaction logic
    // which is complex with jest-mock-extended and Prisma.$transaction.
    // We'll skip deep transaction testing for this MVP unit test and rely on E2E.
});
