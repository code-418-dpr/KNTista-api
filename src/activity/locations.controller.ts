import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
} from "@nestjs/swagger";

import { BaseController } from "./base.controller";
import { IdParamDto } from "./dto/base.dto";
import { LocationsCreateOrUpdateBodyDto, LocationsSearchQueryDto } from "./dto/locations.dto";
import { LocationsService } from "./locations.service";

@Controller("locations")
export class LocationsController extends BaseController<LocationsService> {
    protected static ENTITY_EXAMPLE = {
        id: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
        name: "Some name here",
        isOffline: true,
        address: "Some address here",
    };

    constructor(service: LocationsService) {
        super(service);
    }

    @ApiOperation({ summary: "Search or get all active items" })
    @ApiOkResponse({ example: [LocationsController.ENTITY_EXAMPLE] })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Get()
    async searchOrFindAll(@Query() { name, isOffline, address }: LocationsSearchQueryDto) {
        if (name || isOffline) {
            return this.service.search(
                name,
                isOffline === "true" ? true : isOffline === "false" ? false : undefined,
                address,
            );
        }
        return this.service.findAll();
    }

    @ApiOperation({ summary: "Add new item" })
    @ApiCreatedResponse({ example: LocationsController.ENTITY_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Post("new")
    async insert(@Body() { name, isOffline, address }: LocationsCreateOrUpdateBodyDto) {
        return this.service.insert(name, isOffline, address);
    }

    @ApiOperation({ summary: "Update the item" })
    @ApiOkResponse({ example: LocationsController.ENTITY_EXAMPLE })
    @ApiBadRequestResponse({ example: BaseController.VALIDATION_ERROR_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Put(":id")
    async updateOne(@Param() { id }: IdParamDto, @Body() body: LocationsCreateOrUpdateBodyDto) {
        return this.service.updateOne(id, body.name, body.isOffline, body.address);
    }
}
