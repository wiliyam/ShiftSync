'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, MapPin, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const links = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'Shifts', href: '/admin/shifts', icon: Calendar },
    { name: 'Locations', href: '/admin/locations', icon: MapPin },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1">
            {links.map((link) => {
                const LinkIcon = link.icon;
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={onNavigate}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                    >
                        <LinkIcon className="size-5" />
                        <span>{link.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

function SidebarLogo() {
    return (
        <Link href="/admin" className="flex items-center gap-3 px-3 py-2">
            <div className="rounded-lg bg-primary p-1.5">
                <Image src="/logo.png" width={28} height={28} alt="Logo" />
            </div>
            <div>
                <span className="text-lg font-bold font-outfit">ShiftSync</span>
                <p className="text-xs text-muted-foreground">Admin Console</p>
            </div>
        </Link>
    );
}

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile: Hamburger + Sheet */}
            <div className="flex items-center justify-between border-b p-3 md:hidden">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary p-1.5">
                        <Image src="/logo.png" width={24} height={24} alt="Logo" />
                    </div>
                    <span className="font-bold font-outfit">ShiftSync</span>
                </Link>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="size-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-4">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <SidebarLogo />
                        <Separator className="my-3" />
                        <SidebarNav onNavigate={() => setOpen(false)} />
                        <Separator className="my-3" />
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                            onClick={() => signOut()}
                        >
                            <LogOut className="size-5" />
                            Sign Out
                        </Button>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop: Fixed Sidebar */}
            <div className="hidden md:flex h-full flex-col border-r bg-sidebar px-3 py-4">
                <SidebarLogo />
                <Separator className="my-4" />
                <div className="flex-1">
                    <SidebarNav />
                </div>
                <Separator className="my-4" />
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                    onClick={() => signOut()}
                >
                    <LogOut className="size-5" />
                    Sign Out
                </Button>
            </div>
        </>
    );
}
