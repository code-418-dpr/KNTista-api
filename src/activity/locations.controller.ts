import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
} from "@nestjs/swagger";

import { BaseController } from "./base.controller";
import { IdDto } from "./dto/base.dto";
import { CreateOrUpdateLocationsDto, SearchLocationsDto } from "./dto/locations.dto";
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
    async searchOrFindAll(@Query() query: SearchLocationsDto) {
        if (query.name && query.isOffline) {
            return this.service.search(
                query.name,
                query.isOffline ? query.isOffline === "true" : undefined,
                query.address,
            );
        }
        return this.service.findAll();
    }

    @ApiOperation({ summary: "Add new item" })
    @ApiCreatedResponse({ example: LocationsController.ENTITY_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Post("new")
    async insert(@Body() body: CreateOrUpdateLocationsDto) {
        return this.service.insert(body.name, body.isOffline, body.address);
    }

    @ApiOperation({ summary: "Update the item" })
    @ApiOkResponse({ example: LocationsController.ENTITY_EXAMPLE })
    @ApiBadRequestResponse({ example: BaseController.VALIDATION_ERROR_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Put(":id")
    async updateOne(@Param() { id }: IdDto, @Body() body: CreateOrUpdateLocationsDto) {
        return this.service.updateOne(id, body.name, body.isOffline, body.address);
    }
}
