import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class IdParamDto {
    @ApiProperty({ example: "5c041dcb-be0c-456b-90d7-3ffcbf8790d0" })
    @Expose()
    @JoiSchema(Joi.string().uuid().required())
    id: string;
}

export class NameBodyDto {
    @ApiProperty({ example: "Наименование" })
    @JoiSchema(Joi.string().required())
    name: string;
}

export class NameQueryDto {
    @ApiProperty({ required: false, example: "Наименование" })
    @JoiSchema(Joi.string().optional())
    name?: string;
}

export class IdOrNameDto {
    @ApiProperty({ required: false, example: "5c041dcb-be0c-456b-90d7-3ffcbf8790d0" })
    @JoiSchema(Joi.string().uuid().optional())
    id?: string;

    @ApiProperty({ required: false, example: "Наименование" })
    @JoiSchema(Joi.string().optional())
    name?: string;
}
