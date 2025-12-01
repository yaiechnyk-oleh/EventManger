import { IsDateString, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryEventsDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsDateString()
    dateFrom?: string;

    @IsOptional()
    @IsDateString()
    dateTo?: string;

    @IsOptional()
    @IsString()
    sortBy?: 'dateAsc' | 'dateDesc' | 'titleAsc' | 'titleDesc';

    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    limit?: number;
}
