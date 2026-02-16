// Must define MockAuthError inside the factory since jest.mock is hoisted
jest.mock('next-auth', () => {
    class AuthError extends Error {
        type: string;
        constructor(type: string) {
            super(type);
            this.type = type;
            this.name = 'AuthError';
        }
    }
    return { AuthError };
});

const mockSignIn = jest.fn();
jest.mock('@/auth', () => ({
    signIn: (...args: any[]) => mockSignIn(...args),
}));

import { authenticate } from '@/app/lib/actions';

// Re-import to use in tests
const { AuthError } = jest.requireMock('next-auth') as { AuthError: new (type: string) => Error & { type: string } };

describe('authenticate', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns error when email is missing', async () => {
        const formData = new FormData();
        formData.append('password', 'password123');

        const result = await authenticate(undefined, formData);

        expect(result).toBe('Please enter both email and password.');
    });

    it('returns error when password is missing', async () => {
        const formData = new FormData();
        formData.append('email', 'test@test.com');

        const result = await authenticate(undefined, formData);

        expect(result).toBe('Please enter both email and password.');
    });

    it('calls signIn with credentials on valid input', async () => {
        mockSignIn.mockResolvedValue(undefined);

        const formData = new FormData();
        formData.append('email', 'admin@shiftsync.com');
        formData.append('password', 'password123');

        await authenticate(undefined, formData);

        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
            email: 'admin@shiftsync.com',
            password: 'password123',
        });
    });

    it('returns user-friendly message on CredentialsSignin error', async () => {
        const authError = new AuthError('CredentialsSignin');
        mockSignIn.mockRejectedValue(authError);

        const formData = new FormData();
        formData.append('email', 'wrong@test.com');
        formData.append('password', 'wrongpass');

        const result = await authenticate(undefined, formData);

        expect(result).toBe('Invalid email or password. Please try again.');
    });

    it('returns access denied message on AccessDenied error', async () => {
        const authError = new AuthError('AccessDenied');
        mockSignIn.mockRejectedValue(authError);

        const formData = new FormData();
        formData.append('email', 'disabled@test.com');
        formData.append('password', 'password123');

        const result = await authenticate(undefined, formData);

        expect(result).toBe('Access denied. Your account may be disabled.');
    });

    it('returns generic message on other AuthError types', async () => {
        const authError = new AuthError('OAuthAccountNotLinked');
        mockSignIn.mockRejectedValue(authError);

        const formData = new FormData();
        formData.append('email', 'test@test.com');
        formData.append('password', 'password123');

        const result = await authenticate(undefined, formData);

        expect(result).toBe('Authentication failed. Please try again later.');
    });

    it('re-throws non-AuthError errors', async () => {
        mockSignIn.mockRejectedValue(new TypeError('Network error'));

        const formData = new FormData();
        formData.append('email', 'test@test.com');
        formData.append('password', 'password123');

        await expect(authenticate(undefined, formData)).rejects.toThrow('Network error');
    });
});
