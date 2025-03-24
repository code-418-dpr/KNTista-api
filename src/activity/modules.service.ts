import { Injectable } from "@nestjs/common";
import { and, asc, eq, ilike, max, notInArray } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle.schema";
import { events, modules } from "../drizzle/drizzle.schema";

import { BaseReferencesService } from "./base-references.service";

@Injectable()
export class ModulesService extends BaseReferencesService {
    constructor(db: NodePgDatabase<typeof schema>) {
        super(db, modules, events.moduleId);
    }

    async findAll() {
        return this.db
            .select({
                id: this.table.id,
                name: this.table.name,
                currentMonthEventCount: ModulesService.CURRENT_MONTH_EVENT_COUNT_SQL_EXPR,
            })
            .from(this.table)
            .leftJoin(events, eq(events.moduleId, this.table.id))
            .where(eq(this.table.isDeleted, false))
            .groupBy(this.table.id)
            .orderBy(asc(modules.number));
    }

    async search(name?: string) {
        return this.db
            .select({ id: this.table.id, name: this.table.name })
            .from(this.table)
            .where(and(name ? ilike(this.table.name, `%${name}%`) : undefined, eq(this.table.isDeleted, false)))
            .orderBy(asc(modules.number));
    }

    async getMaxNumber() {
        const queryResults = await this.db
            .select({
                max: max(modules.number),
            })
            .from(this.table)
            .where(eq(this.table.isDeleted, false));
        return queryResults[0].max ?? 0;
    }

    async insert(name: string) {
        const queryResults = await this.db
            .insert(modules)
            .values({ number: (await this.getMaxNumber()) + 1, name })
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

    async updateNumbers(ids: string[]) {
        const notPassedIds = await this.db.query.modules.findMany({
            columns: { id: true },
            where: notInArray(this.table.id, ids),
            orderBy: asc(modules.number),
        });
        ids.push(...notPassedIds.map((item) => item.id));
        if (ids.length > 100) {
            throw new Error();
        }

        return await this.db.transaction(async (tx) => {
            const updatedResults = [];
            for (let i = 0; i < ids.length; ) {
                const queryResults = await tx
                    .update(modules)
                    .set({ number: ++i })
                    .where(eq(this.table.id, ids[i]))
                    .returning();
                updatedResults.push(queryResults[0]);
            }
            return updatedResults;
        });
    }
}
