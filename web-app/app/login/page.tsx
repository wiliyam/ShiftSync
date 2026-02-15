import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen bg-muted/20">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-primary p-3 md:h-36 shadow-lg">
                    <div className="w-32 text-primary-foreground text-2xl font-bold">
                        ShiftSync
                    </div>
                </div>
                <div className="flex-1 rounded-lg bg-card px-6 pb-4 pt-8 shadow-md border border-border">
                    <h1 className="mb-3 text-2xl font-bold text-foreground">
                        Please log in to continue.
                    </h1>
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
