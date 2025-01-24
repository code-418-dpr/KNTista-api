import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsUUID } from "class-validator";

export class ModulesUpdateNumbersBodyDto {
    @IsArray()
    @ArrayMinSize(2)
    @IsUUID("4", { each: true })
    @ApiProperty()
    ids: string[];
}
