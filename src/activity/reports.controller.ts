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
    @ApiInternalServerErrorResponse({ example: BaseController.SWAGGER_EXAMPLES.internal_server_error })
    @Get(":year/:month")
    @Header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    @Header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("Отчёт.docx")}`)
    async getReportForMonth(@Param() { year, month }: ReportsYearAndMonthParamDto) {
        return new StreamableFile(await this.service.genReport(year, month));
    }
}
