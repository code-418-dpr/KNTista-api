import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsUUID } from "class-validator";

export class ModulesUpdateNumbersBodyDto {
    @ApiProperty({ example: ["f5050daa-2e61-4f4f-adda-28cea31608ce", "5c041dcb-be0c-456b-90d7-3ffcbf8790d0"] })
    @IsArray()
    @ArrayMinSize(2)
    @IsUUID("4", { each: true })
    ids: string[];
}
