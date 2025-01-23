import { Injectable } from "@nestjs/common";
import { and, asc, eq, ilike } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/schema";
import { events, locations } from "../drizzle/schema";

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

    async search(name?: string, isOffline?: boolean, address?: string) {
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
                    name ? ilike(this.table.name, name) : undefined,
                    isOffline ? eq(this.table.isOffline, isOffline) : undefined,
                    address ? eq(this.table.address, address) : undefined,
                    eq(this.table.isDeleted, false),
                ),
            )
            .orderBy(asc(this.table.name));
    }

    async insert(name: string, isOffline: boolean, address?: string) {
        return (
            await this.db
                .insert(this.table)
                .values({ name, address, isOffline })
                .onConflictDoUpdate({
                    target: locations.name,
                    set: { isDeleted: false },
                    setWhere: eq(locations.isDeleted, true),
                })
                .returning()
        )[0];
    }

    async updateOne(id: string, name?: string, isOffline?: boolean, address?: string) {
        const updateValues = {
            ...(name !== undefined && { name }),
            ...(address !== undefined && { address }),
            ...(isOffline !== undefined && { isOffline }),
        };
        return (await this.db.update(this.table).set(updateValues).where(eq(this.table.id, id)).returning())[0];
    }
}
