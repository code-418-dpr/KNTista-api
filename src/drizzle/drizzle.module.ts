import { DrizzlePGModule } from "@knaadh/nestjs-drizzle-pg";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import databaseConfig from "../config/database.config";

import * as schema from "./drizzle-schema";

@Module({
    imports: [
        ConfigModule.forFeature(databaseConfig),
        DrizzlePGModule.registerAsync({
            tag: "DB",
            useFactory: (configService: ConfigService) => ({
                pg: {
                    connection: "client",
                    config: {
                        host: configService.get<string>("POSTGRES_HOST"),
                        port: configService.get<number>("POSTGRES_PORT"),
                        user: configService.get<string>("POSTGRES_USER"),
                        password: configService.get<string>("POSTGRES_PASSWORD"),
                        database: configService.get<string>("POSTGRES_DB"),
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
