import { ApiProperty } from "@nestjs/swagger";
import Joi from "joi";
import { JoiSchema } from "nestjs-joi";

import { IdOrNameDto } from "./base.dto";
import { LocationsSearchOrCreateFromEventDto } from "./locations.dto";

export class EventsSearchQueryDto {
    @ApiProperty({ required: false, type: "string", format: "date", example: "2025-01-01" })
    @JoiSchema(
        Joi.string()
            .isoDate()
            .optional()
            .custom((value: string) => new Date(value)),
    )
    startDate?: Date;

    @ApiProperty({ required: false, type: "string", format: "date", example: "2025-01-10" })
    @JoiSchema(
        Joi.string()
            .allow(null)
            .isoDate()
            .optional()
            .custom((value: string) => new Date(value)),
    )
    endDate?: Date;
}

export class EventsCreateBodyDto {
    @ApiProperty()
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            name: Joi.string().optional(),
        })
            .or("id", "name")
            .required(),
    )
    module: IdOrNameDto;

    @ApiProperty({ example: ["2025-01-01"] })
    @JoiSchema(
        Joi.array()
            .items(Joi.string().isoDate())
            .min(1)
            .required()
            .custom((values: string[]) => values.map((v) => new Date(v))),
    )
    startDates: Date[];

    @ApiProperty({ required: false, example: "2025-01-10" })
    @JoiSchema(
        Joi.string()
            .allow(null)
            .isoDate()
            .optional()
            .custom((value: string) => new Date(value)),
    )
    endDate?: Date;

    @ApiProperty()
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            data: Joi.object({
                name: Joi.string().required(),
                isOffline: Joi.boolean().required(),
                address: Joi.string().allow(null).optional(),
            }).optional(),
        })
            .or("id", "data")
            .required(),
    )
    location: LocationsSearchOrCreateFromEventDto;

    @ApiProperty({ example: "Наименование" })
    @JoiSchema(Joi.string().required())
    name: string;

    @ApiProperty()
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            name: Joi.string().optional(),
        })
            .or("id", "name")
            .required(),
    )
    eventType: IdOrNameDto;

    @ApiProperty()
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            name: Joi.string().optional(),
        })
            .or("id", "name")
            .required(),
    )
    responsiblePerson: IdOrNameDto;

    @ApiProperty({ example: 10 })
    @JoiSchema(Joi.number().min(-1).required())
    participantsCount: number;

    @ApiProperty({ example: ["https://habr.com/ru/articles/870470/", "https://vk.com/wall-67577440_6457"] })
    @JoiSchema(Joi.array().items(Joi.string().uri()).min(1).required())
    links: string[];
}

export class EventsUpdateBodyDto {
    @ApiProperty({ required: false })
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            name: Joi.string().optional(),
        })
            .or("id", "name")
            .optional(),
    )
    module?: IdOrNameDto;

    @ApiProperty({ required: false, example: ["2025-01-01"] })
    @JoiSchema(
        Joi.array()
            .items(Joi.string().isoDate())
            .min(1)
            .optional()
            .custom((values: string[]) => values.map((v) => new Date(v))),
    )
    startDates?: Date[];

    @ApiProperty({ required: false, example: "2025-01-10" })
    @JoiSchema(
        Joi.string()
            .allow(null)
            .isoDate()
            .optional()
            .custom((value: string) => new Date(value)),
    )
    endDate?: Date;

    @ApiProperty({ required: false })
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            data: Joi.object({
                name: Joi.string().required(),
                isOffline: Joi.boolean().required(),
                address: Joi.string().allow(null).optional(),
            }).optional(),
        })
            .or("id", "data")
            .optional(),
    )
    location?: LocationsSearchOrCreateFromEventDto;

    @ApiProperty({ required: false, example: "Наименование" })
    @JoiSchema(Joi.string().optional())
    name?: string;

    @ApiProperty({ required: false })
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            name: Joi.string().optional(),
        })
            .or("id", "name")
            .optional(),
    )
    eventType?: IdOrNameDto;

    @ApiProperty({ required: false })
    @JoiSchema(
        Joi.object({
            id: Joi.string().uuid().optional(),
            name: Joi.string().optional(),
        })
            .or("id", "name")
            .optional(),
    )
    responsiblePerson?: IdOrNameDto;

    @ApiProperty({ required: false, example: 10 })
    @JoiSchema(Joi.number().min(-1).optional())
    participantsCount?: number;

    @ApiProperty({
        required: false,
        example: ["https://habr.com/ru/articles/870470/", "https://vk.com/wall-67577440_6457"],
    })
    @JoiSchema(Joi.array().items(Joi.string().uri()).min(1).optional())
    links?: string[];
}

export class EventsDeleteBodyDto {
    @ApiProperty({ example: ["5c041dcb-be0c-456b-90d7-3ffcbf8790d0", "f5050daa-2e61-4f4f-adda-28cea31608ce"] })
    @JoiSchema(Joi.array().items(Joi.string().uuid()).min(1).required())
    ids: string[];
}
