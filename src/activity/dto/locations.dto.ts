import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

import { NameQueryDto } from "./base.dto";

export class LocationsCreateOrUpdateBodyDto {
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

class LocationsCreateFromEventDto {
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

export class LocationsSearchOrCreateFromEventDto {
    @ApiProperty({ required: false })
    @IsUUID()
    @IsOptional()
    id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    data?: LocationsCreateFromEventDto;
}

export class LocationsSearchQueryDto extends NameQueryDto {
    @ApiProperty({ required: false, type: "boolean" })
    @IsBooleanString()
    @IsOptional()
    isOffline?: string;

    @ApiProperty({ required: false, type: "string" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}
