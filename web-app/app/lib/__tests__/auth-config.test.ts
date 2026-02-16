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
});
