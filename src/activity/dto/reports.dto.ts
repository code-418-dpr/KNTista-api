import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class ReportsYearAndMonthParamDto {
    @ApiProperty({ example: "2025" })
    @IsNumberString()
    yearStr: string;

    @ApiProperty({ example: "5" })
    @IsNumberString()
    monthStr: string;
}
