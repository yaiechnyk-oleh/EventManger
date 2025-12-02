import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';

@Injectable()
export class EventsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateEventDto) {
        return this.prisma.event.create({
            data: {
                ...dto,
                date: new Date(dto.date),
            },
        });
    }

    async findAll(query: QueryEventsDto) {
        const {
            category,
            dateFrom,
            dateTo,
            sortBy = 'dateAsc',
            page = 1,
            limit = 10,
        } = query;

        const where: any = {};

        if (category) {
            where.category = category;
        }

        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom) where.date.gte = new Date(dateFrom);
            if (dateTo) where.date.lte = new Date(dateTo);
        }

        let orderBy: any = { date: 'asc' };
        if (sortBy === 'dateDesc') orderBy = { date: 'desc' };
        if (sortBy === 'titleAsc') orderBy = { title: 'asc' };
        if (sortBy === 'titleDesc') orderBy = { title: 'desc' };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.event.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.event.count({ where }),
        ]);

        return {
            items,
            total,
            page,
            limit,
        };
    }

    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }

    async update(id: string, dto: UpdateEventDto) {
        await this.findOne(id); // ensure exists

        return this.prisma.event.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.date ? { date: new Date(dto.date) } : {}),
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // ensure exists
        return this.prisma.event.delete({
            where: { id },
        });
    }

    async getRecommendations(id: string, limit = 5) {
        const base = await this.findOne(id);

        const baseDateMs = new Date(base.date).getTime();
        const weekMs = 7 * 24 * 60 * 60 * 1000;

        const candidates = await this.prisma.event.findMany({
            where: {
                id: { not: base.id },
                OR: [
                    { category: base.category },
                    {
                        date: {
                            gte: new Date(baseDateMs - weekMs),
                            lte: new Date(baseDateMs + weekMs),
                        },
                    },
                    base.location
                        ? {
                            location: {
                                contains: base.location.split(',')[0],
                                mode: 'insensitive',
                            },
                        }
                        : undefined,
                ].filter(Boolean) as any[],
            },
        });

        const scored = candidates.map((event) => {
            let score = 0;

            if (event.category === base.category) score += 3;

            const eventDateMs = new Date(event.date).getTime();
            const diffDays = Math.abs(baseDateMs - eventDateMs) / (1000 * 60 * 60 * 24);
            score += Math.max(0, 2 - diffDays * 0.2);

            if (
                base.location &&
                event.location &&
                event.location.toLowerCase().includes(base.location.split(',')[0].toLowerCase())
            ) {
                score += 2;
            }

            return { event, score };
        });

        return scored
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((s) => s.event);
    }
}
