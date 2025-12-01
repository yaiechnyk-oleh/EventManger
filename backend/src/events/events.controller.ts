import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    create(@Body() dto: CreateEventDto) {
        return this.eventsService.create(dto);
    }

    @Get()
    findAll(@Query() query: QueryEventsDto) {
        return this.eventsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
        return this.eventsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }

    @Get(':id/recommendations')
    getRecommendations(@Param('id') id: string) {
        return this.eventsService.getRecommendations(id);
    }
}
