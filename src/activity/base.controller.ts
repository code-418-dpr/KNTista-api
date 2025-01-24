import { Delete, Get, Param, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { eventTypes, locations, modules, responsiblePersons } from "../drizzle/drizzle-schema";

import { BaseService } from "./base.service";
import { IdParamDto, NameQueryDto } from "./dto/base.dto";

export abstract class BaseController<
    T extends BaseService<typeof eventTypes | typeof modules | typeof responsiblePersons | typeof locations>,
> {
    static VALIDATION_ERROR_EXAMPLE = {
        message: ["id must be a UUID"],
        error: "Bad Request",
        statusCode: 400,
    };

    static INTERNAL_SERVER_ERROR_EXAMPLE = {
        statusCode: 500,
        message: "Internal server error",
    };

    protected static ENTITY_EXAMPLE = {
        id: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
        name: "Some name here",
    };

    protected constructor(protected service: T) {}

    @ApiOperation({ summary: "Search or get all active items" })
    @ApiOkResponse({ example: [BaseController.ENTITY_EXAMPLE] })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Get()
    async searchOrFindAll(@Query() { name }: NameQueryDto) {
        if (name !== undefined) {
            return this.service.search(name);
        }
        return this.service.findAll();
    }

    @ApiOperation({ summary: "Delete the item" })
    @ApiOkResponse()
    @ApiBadRequestResponse({ example: BaseController.VALIDATION_ERROR_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Delete(":id")
    async deleteOne(@Param() { id }: IdParamDto) {
        return this.service.deleteOne(id);
    }

    @ApiOperation({ summary: "Delete all unused items" })
    @ApiOkResponse()
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Delete("unused")
    async deleteUnused() {
        return this.service.deleteUnused();
    }
}
