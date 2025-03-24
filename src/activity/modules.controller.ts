import { Body, Controller, Put } from "@nestjs/common";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { BaseReferencesController } from "./base-references.controller";
import { ModulesUpdateNumbersBodyDto } from "./dto/modules.dto";
import { ModulesService } from "./modules.service";

@Controller("modules")
export class ModulesController extends BaseReferencesController<ModulesService> {
    constructor(protected service: ModulesService) {
        super(service);
    }

    @ApiOperation({ summary: "Change the order of the modules" })
    @ApiOkResponse({ example: ModulesController.SWAGGER_EXAMPLES.entity })
    @ApiBadRequestResponse({ example: ModulesController.SWAGGER_EXAMPLES.validation_error })
    @ApiInternalServerErrorResponse({ example: ModulesController.SWAGGER_EXAMPLES.internal_server_error })
    @Put()
    async updateNumbers(@Body() { ids }: ModulesUpdateNumbersBodyDto) {
        return this.service.updateNumbers(ids);
    }
}
