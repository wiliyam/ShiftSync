import LoginForm from '@/app/ui/login-form';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    return (
        <main className="flex min-h-screen w-full bg-secondary dark:bg-zinc-950">
            {/* Left Side - Brand & Visuals (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm z-10" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

                <div className="relative z-20 flex flex-col items-center text-primary-foreground">
                    <div className="mb-6 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-2xl">
                        <Image src="/logo.png" width={100} height={100} alt="ShiftSync Logo" className="drop-shadow-lg" />
                    </div>
                    <h1 className="text-4xl font-outfit font-bold tracking-tight mb-2">ShiftSync</h1>
                    <p className="text-lg opacity-80 text-center max-w-sm">Empowering Workforces, Syncing Schedules.</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-8 relative">
                {/* Mobile Logo */}
                <div className="lg:hidden mb-8 flex flex-col items-center">
                    <div className="mb-4 rounded-xl bg-primary p-3 shadow-lg">
                        <Image src="/logo.png" width={60} height={60} alt="ShiftSync Logo" />
                    </div>
                    <h1 className="text-2xl font-outfit font-bold text-foreground">ShiftSync</h1>
                </div>

                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-outfit tracking-tight">Welcome Back</CardTitle>
                        <CardDescription>Please sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} ShiftSync Inc. All rights reserved.
                </div>
            </div>
        </main>
    );
}
