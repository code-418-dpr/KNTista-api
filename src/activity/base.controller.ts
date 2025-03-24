import { Delete, Get, Param, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { BaseTable } from "../drizzle/drizzle.schema";

import { BaseService } from "./base.service";
import { IdParamDto, NameQueryDto } from "./dto/base.dto";

export abstract class BaseController<T extends BaseService<BaseTable>> {
    static SWAGGER_EXAMPLES = {
        validation_error: {
            message: ["id must be a UUID"],
            error: "Bad Request",
            statusCode: 400,
        },
        internal_server_error: {
            statusCode: 500,
            message: "Internal server error",
        },
        entity: {
            id: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
            name: "Наименование",
        },
        entity_with_event_count: {
            id: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
            name: "Наименование",
            eventCount: 10,
        },
    };

    protected constructor(protected service: T) {}

    @ApiOperation({ summary: "Search active items by name" })
    @ApiOkResponse({ example: [BaseController.SWAGGER_EXAMPLES.entity] })
    @ApiInternalServerErrorResponse({ example: BaseController.SWAGGER_EXAMPLES.internal_server_error })
    @Get()
    async search(@Query() { name }: NameQueryDto) {
        return this.service.search(name);
    }

    @ApiOperation({ summary: "Get all active items with event stats" })
    @ApiOkResponse({ example: [BaseController.SWAGGER_EXAMPLES.entity_with_event_count] })
    @ApiInternalServerErrorResponse({ example: BaseController.SWAGGER_EXAMPLES.internal_server_error })
    @Get("event-stats")
    async findAll() {
        return this.service.findAll();
    }

    @ApiOperation({ summary: "Delete the item" })
    @ApiOkResponse()
    @ApiBadRequestResponse({ example: BaseController.SWAGGER_EXAMPLES.validation_error })
    @ApiInternalServerErrorResponse({ example: BaseController.SWAGGER_EXAMPLES.internal_server_error })
    @Delete(":id")
    async deleteOne(@Param() { id }: IdParamDto) {
        return this.service.deleteOne(id);
    }

    @ApiOperation({ summary: "Delete all unused items" })
    @ApiOkResponse()
    @ApiInternalServerErrorResponse({ example: BaseController.SWAGGER_EXAMPLES.internal_server_error })
    @Delete("unused")
    async deleteUnused() {
        return this.service.deleteUnused();
    }
}
