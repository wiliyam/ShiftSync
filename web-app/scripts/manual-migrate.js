const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting manual migration...');

    try {
        console.log('Creating Enum "Role"...');
        await prisma.$executeRawUnsafe(`DO $$ BEGIN
            CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`);

        console.log('Creating Enum "ShiftStatus"...');
        await prisma.$executeRawUnsafe(`DO $$ BEGIN
            CREATE TYPE "ShiftStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`);

        console.log('Creating Table "User"...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "User" (
                "id" TEXT NOT NULL,
                "email" TEXT NOT NULL,
                "password" TEXT NOT NULL,
                "name" TEXT,
                "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "User_pkey" PRIMARY KEY ("id")
            );
        `);

        console.log('Creating Table "Employee"...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Employee" (
                "id" TEXT NOT NULL,
                "userId" TEXT NOT NULL,
                "skills" TEXT[],
                "maxHoursPerWeek" INTEGER NOT NULL DEFAULT 40,

                CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
            );
        `);

        console.log('Creating Table "Location"...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Location" (
                "id" TEXT NOT NULL,
                "name" TEXT NOT NULL,
                "address" TEXT,

                CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
            );
        `);

        console.log('Creating Table "Shift"...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "Shift" (
                "id" TEXT NOT NULL,
                "start" TIMESTAMP(3) NOT NULL,
                "end" TIMESTAMP(3) NOT NULL,
                "locationId" TEXT NOT NULL,
                "employeeId" TEXT,
                "requiredSkills" TEXT[],
                "status" "ShiftStatus" NOT NULL DEFAULT 'DRAFT',
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
            );
        `);

        console.log('Creating Indexes and Foreign Keys...');
        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
        `);

        await prisma.$executeRawUnsafe(`
            CREATE UNIQUE INDEX IF NOT EXISTS "Employee_userId_key" ON "Employee"("userId");
        `);

        // Check if constraint exists before adding (Postgres doesn't support IF NOT EXISTS on constraints easily, skipping check for now as table didn't exist)
        // Alternatively, use try-catch for constraints

        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            `);
        } catch (e) { console.log('Constraint Employee_userId_fkey might already exist'); }

        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE "Shift" ADD CONSTRAINT "Shift_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
            `);
        } catch (e) { console.log('Constraint Shift_locationId_fkey might already exist'); }

        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE "Shift" ADD CONSTRAINT "Shift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
            `);
        } catch (e) { console.log('Constraint Shift_employeeId_fkey might already exist'); }

        console.log('Migration completed successfully.');
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
