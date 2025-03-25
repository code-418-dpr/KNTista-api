import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
} from "@nestjs/swagger";

import { BaseController } from "./base.controller";
import { IdParamDto } from "./dto/base.dto";
import { EventsCreateBodyDto, EventsDeleteBodyDto, EventsSearchQueryDto, EventsUpdateBodyDto } from "./dto/events.dto";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
    static SWAGGER_EXAMPLES = {
        ...BaseController.SWAGGER_EXAMPLES,
        entity: {
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
        },
    };

    constructor(private service: EventsService) {}

    @ApiOperation({ summary: "Get all events by date interval" })
    @ApiOkResponse({ example: [EventsController.SWAGGER_EXAMPLES.entity_with_event_count] })
    @ApiInternalServerErrorResponse({ example: EventsController.SWAGGER_EXAMPLES.internal_server_error })
    @Get()
    async findAll(@Query() { startDate, endDate }: EventsSearchQueryDto) {
        return this.service.findAll(startDate, endDate);
    }

    @ApiOperation({ summary: "Add new item" })
    @ApiCreatedResponse({ example: { insertedOrRestored: EventsController.SWAGGER_EXAMPLES.entity } })
    @ApiInternalServerErrorResponse({ example: EventsController.SWAGGER_EXAMPLES.internal_server_error })
    @Post("new")
    async insert(@Body() body: EventsCreateBodyDto) {
        try {
            return await this.service.insert(body);
        } catch (e: unknown) {
            if (typeof e === "object" && e !== null && "message" in e && typeof e.message === "string") {
                if (e.message === "Some of required fields are undefined") {
                    throw new BadRequestException(e.message);
                }
                throw new InternalServerErrorException(e);
            }
            throw new InternalServerErrorException(e);
        }
    }

    @ApiOperation({ summary: "Update the item" })
    @ApiOkResponse({ example: { updated: EventsController.SWAGGER_EXAMPLES.entity } })
    @ApiBadRequestResponse({ example: EventsController.SWAGGER_EXAMPLES.validation_error })
    @ApiInternalServerErrorResponse({ example: EventsController.SWAGGER_EXAMPLES.internal_server_error })
    @Put(":id")
    async updateOne(@Param() { id }: IdParamDto, @Body() body: EventsUpdateBodyDto) {
        try {
            return await this.service.updateOne(id, body);
        } catch (e: unknown) {
            if (typeof e === "object" && e !== null && "code" in e && "message" in e) {
                if (e.code === "23505") {
                    throw new BadRequestException(e.message);
                } else if (e.code === "23503") {
                    throw new BadRequestException(e.message);
                }
                throw new InternalServerErrorException(e);
            }
            throw new InternalServerErrorException(e);
        }
    }

    @ApiOperation({ summary: "Delete the items by ids" })
    @ApiOkResponse()
    @ApiBadRequestResponse({ example: EventsController.SWAGGER_EXAMPLES.validation_error })
    @ApiInternalServerErrorResponse({ example: EventsController.SWAGGER_EXAMPLES.internal_server_error })
    @Delete()
    async deleteMany(@Body() { ids }: EventsDeleteBodyDto) {
        return this.service.deleteMany(ids);
    }
}
