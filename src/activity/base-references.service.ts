import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgColumn } from "drizzle-orm/pg-core";

import { BaseReferenceTable } from "../drizzle/drizzle.schema";
import * as schema from "../drizzle/drizzle.schema";

import { BaseService } from "./base.service";

export abstract class BaseReferencesService extends BaseService<BaseReferenceTable> {
    protected constructor(db: NodePgDatabase<typeof schema>, table: BaseReferenceTable, eventForeignKey: PgColumn) {
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
            return { insertedOrRestored: queryResults[0] };
        }
        return { insertedOrRestored: null };
    }

    async updateOne(id: string, newName: string) {
        const queryResults = await this.db
            .update(this.table)
            .set({ name: newName })
            .where(eq(this.table.id, id))
            .returning();
        if (queryResults.length > 0) {
            return { updated: queryResults[0] };
        }
        return { updated: null };
    }
}
