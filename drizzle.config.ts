import { ConfigService } from "@nestjs/config";
import { defineConfig } from "drizzle-kit";

import databaseConfig from "./src/config/database.config";

const configService = new ConfigService(databaseConfig);

export default defineConfig({
    schema: "./src/drizzle/drizzle-schema.ts",
    out: "./src/drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: configService.get<string>("POSTGRES_HOST")!,
        port: configService.get<number>("POSTGRES_PORT")!,
        user: configService.get<string>("POSTGRES_USER")!,
        password: configService.get<string>("POSTGRES_PASSWORD")!,
        database: configService.get<string>("POSTGRES_DB")!,
        ssl: false,
    },
});
