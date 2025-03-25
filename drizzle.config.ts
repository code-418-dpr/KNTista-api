import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/drizzle/drizzle.schema.ts",
    out: "./src/drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        host: process.env.POSTGRES_HOST!,
        port: +process.env.POSTGRES_PORT!,
        database: process.env.POSTGRES_DB!,
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        ssl: false,
    },
});
