import { ConfigService } from "@nestjs/config";
import { defineConfig } from "drizzle-kit";

import databaseConfig from "./src/config/db.config";

const configService = new ConfigService(databaseConfig);

export default defineConfig({
    schema: "./src/drizzle/drizzle-schema.ts",
    out: "./src/drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: configService.get<string>("db.host")!,
        port: configService.get<number>("db.port")!,
        database: configService.get<string>("db.db")!,
        user: configService.get<string>("db.user")!,
        password: configService.get<string>("db.password")!,
        ssl: false,
    },
});
