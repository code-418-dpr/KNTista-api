import Joi from "@hapi/joi";
import { DrizzlePGModule } from "@knaadh/nestjs-drizzle-pg";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import * as schema from "./drizzle-schema";

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().positive().required(),
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
            }),
            isGlobal: true,
        }),
        DrizzlePGModule.registerAsync({
            tag: "DB",
            useFactory: (configService: ConfigService) => ({
                pg: {
                    connection: "client",
                    config: {
                        host: configService.get("POSTGRES_HOST"),
                        port: 5432,
                        user: configService.get("POSTGRES_USER"),
                        password: configService.get("POSTGRES_PASSWORD"),
                        database: configService.get("POSTGRES_DB"),
                        ssl: false,
                    },
                },
                config: { schema },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DrizzleModule {}
