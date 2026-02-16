import NextAuth from 'next-auth';
// We need to separate config if using Edge runtime, but for now we'll import from auth.ts
// Note: In real production with Edge, we'd split auth.config.ts.
// For simplicity in this Docker setup, we'll basic middleware.

import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
