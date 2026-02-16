import { authConfig } from '@/auth.config';
import { NextRequest } from 'next/server';

// Mock Response for Node environment if not present
if (!global.Response) {
    global.Response = class Response {
        headers: Headers;
        status: number;
        url: string;

        constructor(body?: any, init?: any) {
            this.headers = new Headers(init?.headers);
            this.status = init?.status || 200;
            this.url = init?.url || '';
        }

        static redirect(url: string | URL, status: number = 302) {
            return new Response(null, {
                status,
                headers: { Location: url.toString() },
            });
        }
    } as any;
}
if (!global.Headers) {
    global.Headers = class Headers extends Map {
        get(key: string) { return super.get(key.toLowerCase()); }
        set(key: string, value: string): this { super.set(key.toLowerCase(), value); return this; }
    } as any;
}

// Mock NextRequest since we only need the nextUrl property
const createMockRequest = (pathname: string) => ({
    nextUrl: new URL(`http://localhost:3000${pathname}`),
} as any as NextRequest);

describe('authConfig.authorized callback', () => {
    const authorized = authConfig.callbacks?.authorized;

    if (!authorized) {
        throw new Error('authorized callback not defined');
    }

    it('should redirect ADMIN from /dashboard to /admin', async () => {
        const auth = { user: { role: 'ADMIN' } } as any;
        const request = createMockRequest('/dashboard');

        const result = await authorized({ auth, request });

        expect(result).toBeInstanceOf(Response);
        if (result instanceof Response) {
            expect(result.headers.get('Location')).toBe('http://localhost:3000/admin');
        }
    });

    it('should redirect EMPLOYEE from /admin to /dashboard', async () => {
        const auth = { user: { role: 'EMPLOYEE' } } as any;
        const request = createMockRequest('/admin');

        const result = await authorized({ auth, request });

        expect(result).toBeInstanceOf(Response);
        if (result instanceof Response) {
            expect(result.headers.get('Location')).toBe('http://localhost:3000/dashboard');
        }
    });

    it('should allow ADMIN to access /admin', async () => {
        const auth = { user: { role: 'ADMIN' } } as any;
        const request = createMockRequest('/admin');

        const result = await authorized({ auth, request });

        expect(result).toBe(true);
    });

    it('should allow EMPLOYEE to access /dashboard', async () => {
        const auth = { user: { role: 'EMPLOYEE' } } as any;
        const request = createMockRequest('/dashboard');

        const result = await authorized({ auth, request });

        expect(result).toBe(true);
    });

    it('should return false for unauthenticated users on /dashboard', async () => {
        const auth = null;
        const request = createMockRequest('/dashboard');

        const result = await authorized({ auth, request });

        expect(result).toBe(false);
    });

    it('should return false for unauthenticated users on /admin', async () => {
        const auth = null;
        const request = createMockRequest('/admin');

        const result = await authorized({ auth, request });

        expect(result).toBe(false);
    });

    it('should redirect logged-in ADMIN from /login to /admin', async () => {
        const auth = { user: { role: 'ADMIN' } } as any;
        const request = createMockRequest('/login');

        const result = await authorized({ auth, request });

        expect(result).toBeInstanceOf(Response);
        if (result instanceof Response) {
            expect(result.headers.get('Location')).toBe('http://localhost:3000/admin');
        }
    });

    it('should redirect logged-in EMPLOYEE from /login to /dashboard', async () => {
        const auth = { user: { role: 'EMPLOYEE' } } as any;
        const request = createMockRequest('/login');

        const result = await authorized({ auth, request });

        expect(result).toBeInstanceOf(Response);
        if (result instanceof Response) {
            expect(result.headers.get('Location')).toBe('http://localhost:3000/dashboard');
        }
    });

    it('should allow access to public pages for unauthenticated users', async () => {
        const auth = null;
        const request = createMockRequest('/');

        const result = await authorized({ auth, request });

        expect(result).toBe(true);
    });

    it('should allow access to public pages for authenticated users', async () => {
        const auth = { user: { role: 'EMPLOYEE' } } as any;
        const request = createMockRequest('/about');

        const result = await authorized({ auth, request });

        expect(result).toBe(true);
    });
});

describe('authConfig.jwt callback', () => {
    const jwt = authConfig.callbacks?.jwt;

    if (!jwt) {
        throw new Error('jwt callback not defined');
    }

    it('should add role and id to token when user is present', async () => {
        const token = { sub: 'token-sub' } as any;
        const user = { id: 'user-1', role: 'ADMIN' } as any;

        const result = await jwt({ token, user, account: null, trigger: 'signIn' });

        expect(result.role).toBe('ADMIN');
        expect(result.id).toBe('user-1');
    });

    it('should return token unchanged when user is not present', async () => {
        const token = { sub: 'token-sub', role: 'EMPLOYEE' } as any;

        const result = await jwt({ token, user: undefined as any, account: null, trigger: 'update' });

        expect(result.sub).toBe('token-sub');
        expect(result.role).toBe('EMPLOYEE');
    });
});

describe('authConfig.session callback', () => {
    const session = authConfig.callbacks?.session;

    if (!session) {
        throw new Error('session callback not defined');
    }

    it('should add id and role to session user from token', async () => {
        const mockSession = { user: { name: 'Test', email: 'test@test.com' } } as any;
        const token = { sub: 'user-1', role: 'ADMIN' } as any;

        const result = await session({ session: mockSession, token, user: mockSession.user, trigger: 'update', newSession: null } as any);

        expect(result.user.id).toBe('user-1');
        expect(result.user.role).toBe('ADMIN');
    });

    it('should return session unchanged when token.sub is missing', async () => {
        const mockSession = { user: { name: 'Test' } } as any;
        const token = { role: 'EMPLOYEE' } as any;

        const result = await session({ session: mockSession, token, user: mockSession.user, trigger: 'update', newSession: null } as any);

        expect(result.user.id).toBeUndefined();
    });
});
