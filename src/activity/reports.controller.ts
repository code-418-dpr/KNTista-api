import { Controller, Get, Header, Param, StreamableFile } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { BaseController } from "./base.controller";
import { ReportsYearAndMonthParamDto } from "./dto/reports.dto";
import { ReportsService } from "./reports.service";

@Controller("reports")
export class ReportsController {
    constructor(private readonly service: ReportsService) {}

    @ApiOperation({ summary: "Search or get all active items" })
    @ApiOkResponse()
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Get(":yearStr/:monthStr")
    @Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    @Header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("Отчёт.docx")}`)
    async getReportForMonth(@Param() { yearStr, monthStr }: ReportsYearAndMonthParamDto) {
        const year = +yearStr;
        const month = +monthStr;
        const currentYear = new Date().getFullYear();
        if (year < currentYear - 1 || year > currentYear) {
            throw new Error();
        }
        if (month < 1 || month > 12) {
            throw new Error();
        }
        return new StreamableFile(await this.service.genReport(year, month));
    }
}
