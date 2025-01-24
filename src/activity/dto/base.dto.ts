import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class IdParamDto {
    @ApiProperty()
    @IsUUID()
    id: string;
}

export class NameBodyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class NameQueryDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    name?: string;
}

export class IdOrNameDto {
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
