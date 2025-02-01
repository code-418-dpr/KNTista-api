import { Body, Param, Post, Put } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
} from "@nestjs/swagger";

import { BaseReferencesService } from "./base-references.service";
import { BaseController } from "./base.controller";
import { IdParamDto, NameBodyDto } from "./dto/base.dto";

export abstract class BaseReferencesController<T extends BaseReferencesService> extends BaseController<T> {
    @ApiOperation({ summary: "Add new item" })
    @ApiCreatedResponse({ example: BaseReferencesController.ENTITY_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseReferencesController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Post("new")
    async insert(@Body() { name }: NameBodyDto) {
        return this.service.insert(name);
    }

    @ApiOperation({ summary: "Rename the item" })
    @ApiOkResponse({ example: BaseReferencesController.ENTITY_EXAMPLE })
    @ApiBadRequestResponse({ example: BaseReferencesController.VALIDATION_ERROR_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseReferencesController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Put(":id")
    async updateOne(@Param() { id }: IdParamDto, @Body() { name }: NameBodyDto) {
        return this.service.updateOne(id, name);
    }
}
