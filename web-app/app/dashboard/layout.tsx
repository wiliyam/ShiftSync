import Link from 'next/link';
import { signOut } from '@/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <div className="flex h-full flex-col px-3 py-4 md:px-2">
                    <Link
                        className="mb-2 flex h-20 items-end justify-start rounded-md bg-primary p-4 md:h-40"
                        href="/"
                    >
                        <div className="w-32 text-white md:w-40 text-2xl font-bold">
                            ShiftSync
                        </div>
                    </Link>
                    <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                        <Link
                            href="/dashboard"
                            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-muted/50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/employees"
                            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-muted/50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3"
                        >
                            Employees
                        </Link>
                        <Link
                            href="/dashboard/shifts"
                            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-muted/50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3"
                        >
                            Shifts
                        </Link>
                        <div className="hidden h-auto w-full grow rounded-md bg-muted/20 md:block"></div>
                        <form
                            action={async () => {
                                'use server';
                                await signOut();
                            }}
                        >
                            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-muted/50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary md:flex-none md:justify-start md:p-2 md:px-3">
                                <div className="hidden md:block">Sign Out</div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-background border-l border-border">{children}</div>
        </div>
    );
}
