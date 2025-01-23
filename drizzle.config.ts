import { ConfigService } from "@nestjs/config";
import { defineConfig } from "drizzle-kit";

const configService = new ConfigService();

export default defineConfig({
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: configService.get("POSTGRES_HOST")!,
        port: 5432,
        user: configService.get("POSTGRES_USER")!,
        password: configService.get("POSTGRES_PASSWORD")!,
        database: configService.get("POSTGRES_DB")!,
        ssl: false,
    },
});
