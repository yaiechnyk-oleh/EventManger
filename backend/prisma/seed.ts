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
                latitude: 32.8397,
                longitude: 54.0297,
            },
            {
                title: 'Jazz Night',
                description: 'Live jazz music and drinks.',
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                location: 'Lviv, Ukraine',
                category: 'Music',
                latitude: 49.8397,
                longitude: 24.0297,
            },
            {
                title: 'Football Match',
                description: 'Local league match.',
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                location: 'Lviv, Ukraine',
                category: 'Sport',
                latitude: 59.8397,
                longitude: 21.0297,
            },
            {
                title: 'NodeJS Workshop',
                description: 'Hands-on workshop with Node and NestJS.',
                date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
                location: 'Lviv, Ukraine',
                category: 'Tech',
                latitude: 69.8397,
                longitude: 14.0297,
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
