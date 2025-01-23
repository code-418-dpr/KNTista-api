import { Body, Controller, Put } from "@nestjs/common";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { BaseReferencesController } from "./base-references.controller";
import { ModulesUpdateNumbersDto } from "./dto/modules-update-numbers.dto";
import { ModulesService } from "./modules.service";

@Controller("modules")
export class ModulesController extends BaseReferencesController<ModulesService> {
    constructor(service: ModulesService) {
        super(service);
    }

    @ApiOperation({ summary: "Change the order of the modules" })
    @ApiOkResponse({ example: BaseReferencesController.ENTITY_EXAMPLE })
    @ApiBadRequestResponse({ example: BaseReferencesController.VALIDATION_ERROR_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseReferencesController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Put()
    async updateNumbers(@Body() { ids }: ModulesUpdateNumbersDto) {
        return this.service.updateNumbers(ids);
    }
}
