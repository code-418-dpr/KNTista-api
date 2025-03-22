import { Column, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { eventTypes, modules, responsiblePersons } from "../drizzle/drizzle.schema";
import * as schema from "../drizzle/drizzle.schema";

import { BaseService } from "./base.service";

export abstract class BaseReferencesService extends BaseService<
    typeof eventTypes | typeof modules | typeof responsiblePersons
> {
    protected constructor(
        db: NodePgDatabase<typeof schema>,
        table: typeof eventTypes | typeof modules | typeof responsiblePersons,
        eventForeignKey: Column,
    ) {
        super(db, table, eventForeignKey);
    }

    async insert(name: string) {
        const queryResults = await this.db
            .insert(this.table)
            .values({ name })
            .onConflictDoUpdate({
                target: this.table.name,
                set: { isDeleted: false },
                setWhere: eq(this.table.isDeleted, true),
            })
            .returning();
        if (queryResults.length > 0) {
            return queryResults[0];
        }
    }

    async updateOne(id: string, newName: string) {
        const queryResults = await this.db
            .update(this.table)
            .set({ name: newName })
            .where(eq(this.table.id, id))
            .returning();
        if (queryResults.length > 0) {
            return queryResults[0];
        }
    }
}
