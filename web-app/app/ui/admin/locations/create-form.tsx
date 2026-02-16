'use client';

import { createLocation } from '@/app/lib/location-actions';
import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateLocationForm() {
    const [errorMessage, formAction, isPending] = useActionState(createLocation, undefined);

    return (
        <form action={formAction} className="space-y-4 max-w-lg mx-auto p-6 bg-card rounded-xl shadow-md border border-border">
            <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    required
                    minLength={2}
                    placeholder="Downtown Office"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="123 Main St, City, Country"
                    className="resize-none"
                />
            </div>

            {errorMessage && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className="flex items-center gap-4 mt-6">
                <Button variant="outline" asChild>
                    <Link href="/admin/locations">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Location'}
                </Button>
            </div>
        </form>
    );
}
