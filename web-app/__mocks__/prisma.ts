import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Mock the PrismaClient
const prisma = mockDeep<PrismaClient>();

export default prisma;
export type MockContext = {
    prisma: DeepMockProxy<PrismaClient>;
};
