import { ApiProperty } from "@nestjs/swagger";
import Joi from "joi";
import { JoiSchema } from "nestjs-joi";

export class ModulesUpdateNumbersBodyDto {
    @ApiProperty({ example: ["f5050daa-2e61-4f4f-adda-28cea31608ce", "5c041dcb-be0c-456b-90d7-3ffcbf8790d0"] })
    @JoiSchema(Joi.array().items(Joi.string().uuid()).min(2).required())
    ids: string[];
}
