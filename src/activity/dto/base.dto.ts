import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class IdDto {
    @ApiProperty()
    @IsUUID()
    id: string;
}

export class NameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class SearchByNameDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;
}
