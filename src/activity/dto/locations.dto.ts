import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsBooleanString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOrUpdateLocationsDto {
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

export class SearchLocationsDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

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
