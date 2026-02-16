import { fetchLocations, deleteLocation } from '@/app/lib/location-actions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function LocationsPage() {
    const locations = await fetchLocations();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-outfit">Locations</h1>
                <Button asChild>
                    <Link href="/admin/locations/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Location
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                    <Card key={location.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <form action={deleteLocation.bind(null, location.id)}>
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        title="Delete Location"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </form>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{location.name}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                                {location.address || 'No address provided'}
                            </p>
                        </CardContent>
                        <Separator />
                        <CardFooter className="px-6 py-3 text-sm text-muted-foreground">
                            {location._count.shifts} Shifts
                        </CardFooter>
                    </Card>
                ))}

                {locations.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-secondary/50 rounded-xl border-dashed border-2 border-border">
                        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No Locations Yet</h3>
                        <p className="text-muted-foreground mb-4">Add your first workplace location to get started.</p>
                        <Button variant="link" asChild>
                            <Link href="/admin/locations/create">
                                Create Location &rarr;
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
