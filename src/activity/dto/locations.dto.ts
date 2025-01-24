import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class LocationsCreateOrUpdateBodyDto {
    @ApiProperty({ example: "1 корпус ДонНТУ" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsBoolean()
    isOffline: boolean;

    @ApiProperty({ required: false, example: "г. Донецк, ул. Артёма, 58" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}

class LocationsCreateFromEventDto {
    @ApiProperty({ example: "1 корпус ДонНТУ" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsBoolean()
    isOffline: boolean;

    @ApiProperty({ required: false, example: "г. Донецк, ул. Артёма, 58" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}

export class LocationsSearchOrCreateFromEventDto {
    @ApiProperty({ required: false, example: "f5050daa-2e61-4f4f-adda-28cea31608ce" })
    @IsUUID()
    @IsOptional()
    id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    data?: LocationsCreateFromEventDto;
}

export class LocationsSearchQueryDto {
    @ApiProperty({ required: false, example: "1 корпус ДонНТУ" })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ required: false, type: "boolean" })
    @IsBooleanString()
    @IsOptional()
    isOffline?: string;

    @ApiProperty({ required: false, type: "string", example: "г. Донецк, ул. Артёма, 58" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}
