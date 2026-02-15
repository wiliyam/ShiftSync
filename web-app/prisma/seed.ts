import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Admin
    const adminEmail = 'admin@shiftsync.com'
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Shift Manager',
            password: 'hashed-password-placeholder', // In real app, hash this!
            role: Role.ADMIN,
        },
    })

    // 2. Create Locations
    const loc1 = await prisma.location.create({
        data: { name: 'Main Bar', address: 'Level 1' }
    })

    const loc2 = await prisma.location.create({
        data: { name: 'Rooftop Patio', address: 'Level 3' }
    })

    console.log({ admin, loc1, loc2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
