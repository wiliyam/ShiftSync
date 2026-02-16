const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const email = 'wiliyam@admin.com';

    console.log(`Checking user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log('Current user data:', user);

    if (user.role !== 'ADMIN') {
        console.log('Updating user role to ADMIN...');
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        });
        console.log('User role updated:', updatedUser);
    } else {
        console.log('User is already ADMIN.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
