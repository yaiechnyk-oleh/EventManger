import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.event.deleteMany(); // clear

    await prisma.event.createMany({
        data: [
            {
                title: 'React Conference Lviv',
                description: 'A meetup for React and front-end developers.',
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                location: 'Lviv, Ukraine',
                category: 'Tech',
            },
            {
                title: 'Jazz Night',
                description: 'Live jazz music and drinks.',
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                location: 'Lviv, Ukraine',
                category: 'Music',
            },
            {
                title: 'Football Match',
                description: 'Local league match.',
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                location: 'Lviv, Ukraine',
                category: 'Sport',
            },
            {
                title: 'NodeJS Workshop',
                description: 'Hands-on workshop with Node and NestJS.',
                date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
                location: 'Lviv, Ukraine',
                category: 'Tech',
            },
        ],
    });

    console.log('Seed completed');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
