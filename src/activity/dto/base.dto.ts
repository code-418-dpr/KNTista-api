import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class IdParamDto {
    @ApiProperty({ example: "5c041dcb-be0c-456b-90d7-3ffcbf8790d0" })
    @IsUUID()
    id: string;
}

export class NameBodyDto {
    @ApiProperty({ example: "Наименование" })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class NameQueryDto {
    @ApiProperty({ required: false, example: "Наименование" })
    @IsString()
    @IsOptional()
    name?: string;
}

export class IdOrNameDto {
    @ApiProperty({ required: false, example: "5c041dcb-be0c-456b-90d7-3ffcbf8790d0" })
    @IsUUID()
    @IsOptional()
    id?: string;

    @ApiProperty({ required: false, example: "Наименование" })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;
}
