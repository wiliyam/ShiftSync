import { fetchLocations, deleteLocation } from '@/app/lib/location-actions';
import { MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function LocationsPage() {
    const locations = await fetchLocations();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-outfit">Locations</h1>
                <Link href="/admin/locations/create" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Add Location
                </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                    <div key={location.id} className="rounded-xl bg-card p-6 shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <form action={deleteLocation.bind(null, location.id)}>
                                    <button className="text-muted-foreground hover:text-destructive transition-colors" title="Delete Location">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{location.name}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                                {location.address || 'No address provided'}
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
                            <span>{location._count.shifts} Shifts</span>
                            {/* Future: Add 'View Details' link */}
                        </div>
                    </div>
                ))}

                {locations.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-secondary/50 rounded-xl border-dashed border-2 border-border">
                        <MapPinIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No Locations Yet</h3>
                        <p className="text-muted-foreground mb-4">Add your first workplace location to get started.</p>
                        <Link href="/admin/locations/create" className="text-primary hover:underline font-medium">
                            Create Location &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
