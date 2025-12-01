import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(2000)
    description?: string;

    @IsDateString()
    date: string; // ISO string

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    location: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    category: string;

    @IsOptional()
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @IsNumber()
    longitude?: number;
}
