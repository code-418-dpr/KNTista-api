import { Injectable } from "@nestjs/common";
import { asc, eq, max, notInArray } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/schema";
import { events, modules } from "../drizzle/schema";

import { BaseReferencesService } from "./base-references.service";

@Injectable()
export class ModulesService extends BaseReferencesService {
    constructor(db: NodePgDatabase<typeof schema>) {
        super(db, modules, events.moduleId);
    }

    async findAll() {
        return this.db
            .select({
                id: modules.id,
                name: modules.name,
                currentMonthEventCount: ModulesService.CURRENT_MONTH_EVENT_COUNT_SQL_EXPR,
            })
            .from(modules)
            .leftJoin(events, eq(events.moduleId, modules.id))
            .where(eq(modules.isDeleted, false))
            .groupBy(modules.id)
            .orderBy(asc(modules.number));
    }

    async getMaxNumber() {
        return (
            await this.db
                .select({
                    max: max(modules.number),
                })
                .from(modules)
                .where(eq(modules.isDeleted, false))
        )[0].max!;
    }

    async insert(name: string) {
        return (
            await this.db
                .insert(modules)
                .values({ number: (await this.getMaxNumber()) + 1, name })
                .onConflictDoUpdate({
                    target: this.table.name,
                    set: { isDeleted: false },
                    setWhere: eq(this.table.isDeleted, true),
                })
                .returning()
        )[0];
    }

    async updateNumbers(ids: string[]) {
        const notPassedIds = await this.db.query.modules.findMany({
            columns: { id: true },
            where: notInArray(modules.id, ids),
            orderBy: asc(modules.number),
        });
        ids.push(...notPassedIds.map((item) => item.id));

        return await this.db.transaction(async (tx) => {
            const updatedResults = [];
            for (let i = 0; i < ids.length; ) {
                const id = ids[i];
                const result = (
                    await tx.update(schema.modules).set({ number: ++i }).where(eq(schema.modules.id, id)).returning()
                )[0];
                updatedResults.push(result);
            }
            return updatedResults;
        });
    }
}
