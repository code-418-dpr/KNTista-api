import { Injectable } from "@nestjs/common";
import { and, asc, eq, ilike, isNull } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle.schema";
import { events, locations } from "../drizzle/drizzle.schema";

import { BaseService } from "./base.service";

@Injectable()
export class LocationsService extends BaseService<typeof locations> {
    constructor(db: NodePgDatabase<typeof schema>) {
        super(db, locations, events.locationId);
    }

    async findAll() {
        return super.findAll({
            id: this.table.id,
            name: this.table.name,
            isOffline: this.table.isOffline,
            address: this.table.address,
            currentMonthEventCount: BaseService.CURRENT_MONTH_EVENT_COUNT_SQL_EXPR,
        });
    }

    async search(name?: string, isOffline?: boolean, address?: string | null) {
        return this.db
            .select({
                id: this.table.id,
                name: this.table.name,
                isOffline: this.table.isOffline,
                address: this.table.address,
            })
            .from(this.table)
            .where(
                and(
                    name === undefined ? undefined : ilike(this.table.name, `%${name}%`),
                    isOffline === undefined ? undefined : eq(this.table.isOffline, isOffline),
                    address === undefined
                        ? undefined
                        : address === null
                          ? isNull(this.table.address)
                          : ilike(this.table.address, `%${address}%`),
                    eq(this.table.isDeleted, false),
                ),
            )
            .orderBy(asc(this.table.name));
    }

    async insert(name: string, isOffline: boolean, address?: string | null) {
        const queryResults = await this.db
            .insert(this.table)
            .values({ name, address, isOffline })
            .onConflictDoUpdate({
                target: locations.name,
                set: { isDeleted: false },
                setWhere: eq(locations.isDeleted, true),
            })
            .returning();
        if (queryResults.length > 0) {
            return { insertedOrRestored: queryResults[0] };
        }
        return { insertedOrRestored: null };
    }

    async updateOne(id: string, name?: string, isOffline?: boolean, address?: string | null) {
        const updateValues = {
            ...(name !== undefined && { name }),
            ...(address !== undefined && { address }),
            ...(isOffline !== undefined && { isOffline }),
        };
        const queryResults = await this.db
            .update(this.table)
            .set(updateValues)
            .where(eq(this.table.id, id))
            .returning();
        if (queryResults.length > 0) {
            return queryResults[0];
        }
    }
}
