import { ApiProperty } from "@nestjs/swagger";
import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    IsUrl,
    Min,
} from "class-validator";

import { IdOrNameDto } from "./base.dto";
import { LocationsSearchOrCreateFromEventDto } from "./locations.dto";

export class EventsSearchQueryDto {
    @ApiProperty({ required: false, type: "string", format: "date", example: "2025-01-01" })
    @IsDateString()
    @IsOptional()
    startDateStr?: string;

    @ApiProperty({ required: false, type: "string", format: "date", example: "2025-01-10" })
    @IsDateString()
    @IsOptional()
    endDateStr?: string;
}

export class EventsCreateBodyDto {
    @ApiProperty()
    module: IdOrNameDto;

    @ApiProperty({ example: ["2025-01-01"] })
    @IsArray()
    @ArrayMinSize(1)
    @IsDateString(undefined, { each: true })
    startDatesStr: string[];

    @ApiProperty({ required: false, example: "2025-01-10" })
    @IsDateString()
    @IsOptional()
    endDateStr?: string;

    @ApiProperty()
    location: LocationsSearchOrCreateFromEventDto;

    @ApiProperty({ example: "Наименование" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    eventType: IdOrNameDto;

    @ApiProperty()
    responsiblePerson: IdOrNameDto;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(-1)
    participantsCount: number;

    @ApiProperty({ example: ["https://habr.com/ru/articles/870470/", "https://vk.com/wall-67577440_6457"] })
    @IsArray()
    @ArrayMinSize(1)
    @IsUrl(undefined, { each: true })
    links: string[];
}

export class EventsDeleteBodyDto {
    @ApiProperty({ example: ["5c041dcb-be0c-456b-90d7-3ffcbf8790d0", "f5050daa-2e61-4f4f-adda-28cea31608ce"] })
    @IsArray()
    @IsNotEmpty()
    @IsUUID("4", { each: true })
    ids: string[];
}
