import { Controller, Get, Header, InternalServerErrorException, Param, StreamableFile } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { BaseController } from "./base.controller";
import { ReportsYearAndMonthParamDto } from "./dto/reports.dto";
import { ReportsService } from "./reports.service";

const MONTH_NAMES = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
];

@Controller("reports")
export class ReportsController {
    constructor(private readonly service: ReportsService) {}

    @ApiOperation({ summary: "Search or get all active items" })
    @ApiOkResponse()
    @ApiInternalServerErrorResponse({ example: BaseController.SWAGGER_EXAMPLES.internal_server_error })
    @Get(":year/:month")
    @Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    async getReportForMonth(@Param() { year, month }: ReportsYearAndMonthParamDto) {
        try {
            const fileStream = await this.service.genReport(year, month);
            const monthName = MONTH_NAMES[month - 1];
            const filename = `${monthName} ${year}.docx`;

            return new StreamableFile(fileStream, {
                disposition: `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
            });
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
