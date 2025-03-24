import { BadRequestException, Body, InternalServerErrorException, Param, Post, Put } from "@nestjs/common";
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
    protected constructor(protected service: T) {
        super(service);
    }

    @ApiOperation({ summary: "Add new item" })
    @ApiCreatedResponse({ example: BaseReferencesController.SWAGGER_EXAMPLES.entity })
    @ApiInternalServerErrorResponse({ example: BaseReferencesController.SWAGGER_EXAMPLES.internal_server_error })
    @Post("new")
    async insert(@Body() { name }: NameBodyDto) {
        try {
            return await this.service.insert(name);
        } catch (e: unknown) {
            if (typeof e === "object" && e !== null && "code" in e && e.code === "23505") {
                throw new BadRequestException("Unique key violation during update");
            }
            throw new InternalServerErrorException(e);
        }
    }

    @ApiOperation({ summary: "Rename the item" })
    @ApiOkResponse({ example: BaseReferencesController.SWAGGER_EXAMPLES.entity })
    @ApiBadRequestResponse({ example: BaseReferencesController.SWAGGER_EXAMPLES.validation_error })
    @ApiInternalServerErrorResponse({ example: BaseReferencesController.SWAGGER_EXAMPLES.internal_server_error })
    @Put(":id")
    async updateOne(@Param() { id }: IdParamDto, @Body() { name }: NameBodyDto) {
        try {
            return await this.service.updateOne(id, name);
        } catch (e: unknown) {
            if (typeof e === "object" && e !== null && "code" in e && e.code === "23505") {
                throw new BadRequestException("Unique key violation during update");
            }
            throw new InternalServerErrorException(e);
        }
    }
}
