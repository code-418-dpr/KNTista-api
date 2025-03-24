import { Inject } from "@nestjs/common";
import {
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
import { PgColumn } from "drizzle-orm/pg-core";

import { BaseTable, events } from "../drizzle/drizzle.schema";
import * as schema from "../drizzle/drizzle.schema";

export abstract class BaseService<T extends BaseTable> {
    protected static CURRENT_MONTH_EVENT_COUNT_SQL_EXPR = count(sql`CASE
        WHEN date_trunc('month', current_date) >= date_trunc('month', ${events.startDates}[1])
            AND ${events.endDate} IS NULL OR date_trunc('month', current_date) <= date_trunc('month', ${events.endDate})
        THEN 1
        ELSE NULL 
    END`);

    protected constructor(
        @Inject("DB") protected readonly db: NodePgDatabase<typeof schema>,
        protected readonly table: T,
        protected readonly eventForeignKey: PgColumn,
    ) {}

    async getIdByName(name: string) {
        const queryResults = await this.db
            .select({ id: this.table.id })
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            .from(this.table as BaseTable)
            .where(eq(this.table.name, name))
            .limit(1);
        if (queryResults.length > 0) {
            return queryResults[0].id;
        }
    }

    async findAll(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        select: SelectedFields<PgColumn<ColumnBaseConfig<ColumnDataType, ColumnDataType>>, any> = {
            id: this.table.id,
            name: this.table.name,
            currentMonthEventCount: BaseService.CURRENT_MONTH_EVENT_COUNT_SQL_EXPR,
        },
    ) {
        return (
            this.db
                .select(select)
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                .from(this.table as BaseTable)
                .leftJoin(events, eq(this.eventForeignKey, this.table.id))
                .where(eq(this.table.isDeleted, false))
                .groupBy(this.table.id)
                .orderBy(desc(BaseService.CURRENT_MONTH_EVENT_COUNT_SQL_EXPR), asc(this.table.name))
        );
    }

    async search(name?: string) {
        return (
            this.db
                .select({ id: this.table.id, name: this.table.name })
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                .from(this.table as BaseTable)
                .where(and(name ? ilike(this.table.name, `%${name}%`) : undefined, eq(this.table.isDeleted, false)))
                .orderBy(asc(this.table.name))
        );
    }

    async deleteOne(id: string) {
        const isUsedInEvent = !!(await this.db.query.events.findFirst({
            columns: { id: true },
            where: eq(this.eventForeignKey, id),
        }));
        if (isUsedInEvent) {
            await this.db
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                .update(this.table as BaseTable)
                .set({ isDeleted: true })
                .where(eq(this.table.id, id));
            return { id, isDeleted: false, isMarkedAsDeleted: true };
        } else {
            const queryResult = await this.db.delete(this.table).where(eq(this.table.id, id));
            return { id, isDeleted: !!queryResult.rowCount, isMarkedAsDeleted: false };
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
