import { ApiProperty } from "@nestjs/swagger";
import Joi from "joi";
import { JoiSchema } from "nestjs-joi";

const locationsCreateOrUpdateBodySchema = Joi.object({
    name: Joi.string().required(),
    isOffline: Joi.boolean().required(),
    address: Joi.string().allow(null).optional(),
});

export class LocationsCreateBodyDto {
    @ApiProperty({ example: "1 корпус ДонНТУ" })
    @JoiSchema(Joi.string().required())
    name: string;

    @ApiProperty()
    @JoiSchema(Joi.boolean().required())
    isOffline: boolean;

    @ApiProperty({ required: false, type: "string", nullable: true, example: "г. Донецк, ул. Артёма, 58" })
    @JoiSchema(Joi.string().allow(null).optional())
    address?: string | null;
}

export class LocationsUpdateBodyDto {
    @ApiProperty({ required: false, example: "1 корпус ДонНТУ" })
    @JoiSchema(Joi.string().optional())
    name: string;

    @ApiProperty({ required: false })
    @JoiSchema(Joi.boolean().optional())
    isOffline?: boolean;

    @ApiProperty({ required: false, type: "string", nullable: true, example: "г. Донецк, ул. Артёма, 58" })
    @JoiSchema(Joi.string().allow(null).optional())
    address?: string | null;
}

export class LocationsSearchOrCreateFromEventDto {
    @ApiProperty({ required: false, example: "f5050daa-2e61-4f4f-adda-28cea31608ce" })
    @JoiSchema(Joi.string().uuid().optional())
    id?: string;

    @ApiProperty({ required: false })
    @JoiSchema(locationsCreateOrUpdateBodySchema.optional())
    data?: LocationsCreateBodyDto;
}

export class LocationsSearchQueryDto {
    @ApiProperty({ required: false, example: "1 корпус ДонНТУ" })
    @JoiSchema(Joi.string().optional())
    name?: string;

    @ApiProperty({ required: false, type: "boolean" })
    @JoiSchema(Joi.boolean().optional())
    isOffline?: boolean;

    @ApiProperty({ required: false, type: "string", nullable: true, example: "г. Донецк, ул. Артёма, 58" })
    @JoiSchema(Joi.string().allow(null).optional())
    address?: string | null;
}
