import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
} from "@nestjs/swagger";

import { BaseController } from "./base.controller";
import { CreateEventsDto, DeleteEventsDto, SearchEventsDto } from "./dto/events.dto";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
    protected static ENTITY_EXAMPLE = {
        id: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
        moduleId: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
        startDates: ["2025-01-23", "2025-02-01"],
        endDate: "2025-02-10",
        locationId: "1e610e3b-ceef-4d50-8027-9c97685d9bc5",
        name: "Some event",
        eventTypeId: "b686f4cc-6a76-43cc-a103-4d2aad71ce09",
        responsiblePersonId: "6e5c99e1-3b29-4f04-9fac-6d0aa7d1c446",
        participantsCount: 10,
        links: ["https://vk.com"],
    };

    constructor(private service: EventsService) {}

    @ApiOperation({ summary: "Get all events by date interval" })
    @ApiOkResponse({ example: [EventsController.ENTITY_EXAMPLE] })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Get()
    async findAll(@Query() query: SearchEventsDto) {
        let startDate: Date | undefined, endDate: Date | undefined;
        if (query.startDate) {
            startDate = new Date(query.startDate);
        }
        if (query.endDate) {
            endDate = new Date(query.endDate);
        }
        return this.service.findAll(startDate, endDate);
    }

    @ApiOperation({ summary: "Add new item" })
    @ApiCreatedResponse({ example: EventsController.ENTITY_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Post("new")
    async insert(@Body() body: CreateEventsDto) {
        return this.service.insert(
            body.module,
            body.startDates,
            body.endDate,
            body.location,
            body.name,
            body.eventType,
            body.responsiblePerson,
            body.participantsCount,
            body.links,
        );
    }

    @ApiOperation({ summary: "Delete the items by ids" })
    @ApiOkResponse()
    @ApiBadRequestResponse({ example: BaseController.VALIDATION_ERROR_EXAMPLE })
    @ApiInternalServerErrorResponse({ example: BaseController.INTERNAL_SERVER_ERROR_EXAMPLE })
    @Delete()
    async deleteMany(@Body() { ids }: DeleteEventsDto) {
        return this.service.deleteMany(ids);
    }
}
