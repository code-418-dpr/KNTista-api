import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import { eventTypesData, locationsData, modulesData, responsiblePersonsData } from "./db-seeder.data";
import { eventTypes, locations, modules, responsiblePersons } from "./drizzle.schema";

const db = drizzle(
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
);

async function seedDatabase() {
    return db.transaction(async (tx) => {
        for (const table of [modules, eventTypes, responsiblePersons, locations]) {
            await tx.delete(table);
        }

        await tx.insert(modules).values(modulesData);
        await tx.insert(eventTypes).values(eventTypesData);
        await tx.insert(responsiblePersons).values(responsiblePersonsData);
        await tx.insert(locations).values(locationsData);
    });
}

void seedDatabase();
