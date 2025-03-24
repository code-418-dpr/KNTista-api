import {
    BadRequestException,
    Body,
    Controller,
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
import { LocationsCreateOrUpdateBodyDto, LocationsSearchQueryDto } from "./dto/locations.dto";
import { LocationsService } from "./locations.service";

@Controller("locations")
export class LocationsController extends BaseController<LocationsService> {
    static SWAGGER_EXAMPLES = {
        ...BaseController.SWAGGER_EXAMPLES,
        entity: {
            id: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
            name: "Some name here",
            isOffline: true,
            address: "Some address here",
        },
        entity_with_event_count: {
            id: "cfc3fab7-1d56-42d4-a489-8a553d81d66d",
            name: "Some name here",
            isOffline: true,
            address: "Some address here",
            eventCount: 10,
        },
    };

    constructor(protected service: LocationsService) {
        super(service);
    }

    @ApiOperation({ summary: "Search or get all active items" })
    @ApiOkResponse({ example: [LocationsController.SWAGGER_EXAMPLES.entity] })
    @ApiInternalServerErrorResponse({ example: LocationsController.SWAGGER_EXAMPLES.internal_server_error })
    @Get()
    async search(@Query() { name, isOffline, address }: LocationsSearchQueryDto) {
        return this.service.search(name, isOffline, address);
    }

    @ApiOperation({ summary: "Get all active items" })
    @ApiOkResponse({ example: [LocationsController.SWAGGER_EXAMPLES.entity_with_event_count] })
    @ApiInternalServerErrorResponse({ example: LocationsController.SWAGGER_EXAMPLES.internal_server_error })
    @Get("event-stats")
    async findAll() {
        return this.service.findAll();
    }

    @ApiOperation({ summary: "Add new item" })
    @ApiCreatedResponse({ example: LocationsController.SWAGGER_EXAMPLES.entity_with_event_count })
    @ApiInternalServerErrorResponse({ example: LocationsController.SWAGGER_EXAMPLES.internal_server_error })
    @Post("new")
    async insert(@Body() { name, isOffline, address }: LocationsCreateOrUpdateBodyDto) {
        return this.service.insert(name, isOffline, address);
    }

    @ApiOperation({ summary: "Update the item" })
    @ApiOkResponse({ example: LocationsController.SWAGGER_EXAMPLES.entity })
    @ApiBadRequestResponse({ example: LocationsController.SWAGGER_EXAMPLES.validation_error })
    @ApiInternalServerErrorResponse({ example: LocationsController.SWAGGER_EXAMPLES.internal_server_error })
    @Put(":id")
    async updateOne(@Param() { id }: IdParamDto, @Body() body: LocationsCreateOrUpdateBodyDto) {
        try {
            return await this.service.updateOne(id, body.name, body.isOffline, body.address);
        } catch (e: unknown) {
            if (typeof e === "object" && e !== null && "code" in e && e.code === "23505") {
                throw new BadRequestException("Unique key violation during update");
            }
            throw new InternalServerErrorException(e);
        }
    }
}
