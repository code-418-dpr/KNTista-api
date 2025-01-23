import { ApiProperty } from "@nestjs/swagger";
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
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

export class SearchEventsDto {
    @ApiProperty({ required: false, type: "string", format: "date" })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiProperty({ required: false, type: "string", format: "date" })
    @IsDateString()
    @IsOptional()
    endDate?: string;
}

class IdOrNameDto {
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    id?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;
}

class CreateLocationFromEventDataDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsBoolean()
    isOffline: boolean;

    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}

class SearchOrCreateLocationFromEventDto {
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    data?: CreateLocationFromEventDataDto;
}

export class CreateEventsDto {
    @ApiProperty()
    module: IdOrNameDto;

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    @IsDateString(undefined, { each: true })
    startDates: string[];

    @ApiProperty({ required: false })
    @ValidateIf((o) => o.endDate && o.startDates.filter((date: string) => new Date(o.endDate) > new Date(date)))
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiProperty()
    location: SearchOrCreateLocationFromEventDto;

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

export class DeleteEventsDto {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    @IsUUID("4", { each: true })
    ids: string[];
}
