import { DrizzlePGModule } from "@knaadh/nestjs-drizzle-pg";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import databaseConfig from "../config/db.config";

import * as schema from "./drizzle.schema";

@Module({
    imports: [
        ConfigModule.forFeature(databaseConfig),
        DrizzlePGModule.registerAsync({
            tag: "DB",
            useFactory: (configService: ConfigService) => ({
                pg: {
                    connection: "client",
                    config: {
                        host: configService.get<string>("db.host"),
                        port: configService.get<number>("db.port"),
                        database: configService.get<string>("db.db"),
                        user: configService.get<string>("db.user"),
                        password: configService.get<string>("db.password"),
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
