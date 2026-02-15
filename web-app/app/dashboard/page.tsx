export default async function Page() {
    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl font-bold">
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Cards will go here */}
                <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Employees</h3>
                    <p className="text-2xl font-bold">--</p>
                </div>
                <div className="rounded-xl bg-card p-4 shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Pending Shifts</h3>
                    <p className="text-2xl font-bold">--</p>
                </div>
            </div>
        </main>
    );
}
