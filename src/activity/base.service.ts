import { Inject } from "@nestjs/common";
import {
    Column,
    ColumnBaseConfig,
    ColumnDataType,
    SelectedFields,
    and,
    asc,
    count,
    desc,
    eq,
    exists,
    ilike,
    not,
    sql,
} from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { eventTypes, events, locations, modules, responsiblePersons } from "../drizzle/drizzle-schema";
import * as schema from "../drizzle/drizzle-schema";

export abstract class BaseService<
    T extends typeof eventTypes | typeof modules | typeof responsiblePersons | typeof locations,
> {
    protected static CURRENT_MONTH_EVENT_COUNT_SQL_EXPR = count(sql`CASE
        WHEN date_trunc('month', current_date) >= date_trunc('month', ${events.startDates}[1])
            AND ${events.endDate} IS NULL OR date_trunc('month', current_date) <= date_trunc('month', ${events.endDate})
        THEN 1
        ELSE NULL 
    END`);

    protected constructor(
        @Inject("DB") protected readonly db: NodePgDatabase<typeof schema>,
        protected readonly table: T,
        protected readonly eventForeignKey: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>,
    ) {}

    async getIdByName(name: string) {
        const queryResults = await this.db
            .select({ id: this.table.id })
            .from(this.table)
            .where(eq(this.table.name, name))
            .limit(1);
        if (queryResults.length > 0) {
            return queryResults[0].id;
        }
    }

    async findAll(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        select: SelectedFields<Column<ColumnBaseConfig<ColumnDataType, ColumnDataType>, object, object>, any> = {
            id: this.table.id,
            name: this.table.name,
            currentMonthEventCount: BaseService.CURRENT_MONTH_EVENT_COUNT_SQL_EXPR,
        },
    ) {
        return this.db
            .select(select)
            .from(this.table)
            .leftJoin(events, eq(this.eventForeignKey, this.table.id))
            .where(eq(this.table.isDeleted, false))
            .groupBy(this.table.id)
            .orderBy(desc(count(events.id)), asc(this.table.name));
    }

    async search(name: string) {
        return this.db
            .select({ id: this.table.id, name: this.table.name })
            .from(this.table)
            .where(and(ilike(this.table.name, `%${name}%`), eq(this.table.isDeleted, false)))
            .orderBy(asc(this.table.name));
    }

    async deleteOne(id: string) {
        const isUsedInEvent = !!(await this.db.query.events.findFirst({
            columns: { id: true },
            where: eq(this.eventForeignKey, id),
        }));
        if (isUsedInEvent) {
            await this.db
                .update(this.table as typeof eventTypes | typeof modules | typeof responsiblePersons | typeof locations)
                .set({ isDeleted: true })
                .where(eq(this.table.id, id));
            return { deleted: false, restored: true };
        } else {
            const queryResult = await this.db.delete(this.table).where(eq(this.table.id, id));
            return { deleted: !!queryResult.rowCount, restored: false };
        }
    }

    async deleteUnused() {
        const queryResult = await this.db
            .delete(this.table)
            .where(
                and(
                    eq(this.table.isDeleted, true),
                    not(exists(this.db.select().from(events).where(eq(this.eventForeignKey, this.table.id)))),
                ),
            );
        return { deletedRowCount: queryResult.rowCount ?? 0 };
    }
}
