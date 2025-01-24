import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class ReportsYearAndMonthParamDto {
    @ApiProperty()
    @IsNumberString()
    yearStr: string;

    @ApiProperty()
    @IsNumberString()
    monthStr: string;
}
