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
    ValidateIf,
} from "class-validator";

import { IdOrNameDto } from "./base.dto";
import { LocationsSearchOrCreateFromEventDto } from "./locations.dto";

export class EventsSearchQueryDto {
    @ApiProperty({ required: false, type: "string", format: "date" })
    @IsDateString()
    @IsOptional()
    startDateStr?: string;

    @ApiProperty({ required: false, type: "string", format: "date" })
    @IsDateString()
    @IsOptional()
    endDateStr?: string;
}

export class EventsCreateBodyDto {
    @ApiProperty()
    module: IdOrNameDto;

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    @IsDateString(undefined, { each: true })
    startDatesStr: string[];

    @ApiProperty({ required: false })
    @IsDateString()
    @IsOptional()
    endDateStr?: string;

    @ApiProperty()
    location: LocationsSearchOrCreateFromEventDto;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    eventType: IdOrNameDto;

    @ApiProperty()
    responsiblePerson: IdOrNameDto;

    @ApiProperty()
    @IsNumber()
    @Min(-1)
    participantsCount: number;

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    @IsUrl(undefined, { each: true })
    links: string[];
}

export class EventsDeleteBodyDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    @IsUUID("4", { each: true })
    ids: string[];
}
