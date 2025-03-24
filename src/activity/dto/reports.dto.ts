import { ApiProperty } from "@nestjs/swagger";
import Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class ReportsYearAndMonthParamDto {
    @ApiProperty({ example: "2025" })
    @JoiSchema(
        Joi.string()
            .pattern(/^\d{4}$/)
            .required()
            .custom((value: string) => {
                const num = +value;
                const currentYear = new Date().getFullYear();
                if (num < 2000 || num > currentYear) {
                    throw new Error("year must be between 2000 and current year");
                }
                return num;
            }),
    )
    year: number;

    @ApiProperty({ example: "5" })
    @JoiSchema(
        Joi.string()
            .pattern(/^\d+$/)
            .required()
            .custom((value: string) => {
                const num = +value;
                if (num < 1 || num > 12) {
                    throw new Error("month must be between 1 and 12");
                }
                return num;
            }),
    )
    month: number;
}
