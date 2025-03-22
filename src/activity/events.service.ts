import { Inject, Injectable } from "@nestjs/common";
import { inArray, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import { events } from "../drizzle/drizzle.schema";
import * as schema from "../drizzle/drizzle.schema";

import { EventTypesService } from "./event-types.service";
import { LocationsService } from "./locations.service";
import { ModulesService } from "./modules.service";
import { ResponsiblePersonsService } from "./responsible-persons.service";

@Injectable()
export class EventsService {
    constructor(
        @Inject("DB") private readonly db: NodePgDatabase<typeof schema>,
        private readonly eventTypesService: EventTypesService,
        private readonly modulesService: ModulesService,
        private readonly locationsService: LocationsService,
        private readonly responsiblePersonsService: ResponsiblePersonsService,
    ) {}

    async findAll(startDate?: Date, endDate?: Date) {
        const currentDate = new Date();
        startDate ??= new Date(currentDate.getFullYear(), currentDate.getMonth());
        endDate ??= new Date(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
        return this.db.query.events.findMany({
            with: {
                module: {
                    columns: {
                        number: true,
                        name: true,
                    },
                },
                location: {
                    columns: {
                        name: true,
                        address: true,
                        isOffline: true,
                    },
                },
                eventType: {
                    columns: {
                        name: true,
                    },
                },
                responsiblePerson: {
                    columns: {
                        name: true,
                    },
                },
            },
            where: sql.join([
                sql`${events.startDates}[1] >=`,
                sql.raw(`'${startDate.toLocaleDateString("en-US")}'`),
                sql`AND (${events.endDate} IS NULL OR ${events.endDate} <=`,
                sql.raw(`'${endDate.toLocaleDateString("en-US")}')`),
            ]),
        });
    }

    async insert(
        module: { id?: string; name?: string },
        startDatesStr: string[],
        endDateStr: string | null | undefined,
        location: { id?: string; data?: { name: string; isOffline: boolean; address?: string | null } },
        name: string,
        eventType: { id?: string; name?: string },
        responsiblePerson: { id?: string; name?: string },
        participantsCount: number,
        links: string[],
    ) {
        const moduleId = module.id ?? (await this.modulesService.getIdByName(module.name!));
        const responsiblePersonId =
            responsiblePerson.id ?? (await this.responsiblePersonsService.getIdByName(responsiblePerson.name!));
        const locationId =
            location.id ??
            (await this.locationsService.insert(location.data!.name, location.data!.isOffline, location.data!.address))
                ?.id ??
            (await this.locationsService.getIdByName(location.data!.name));
        const eventTypeId =
            eventType.id ??
            (await this.eventTypesService.insert(eventType.name!))?.id ??
            (await this.eventTypesService.getIdByName(eventType.name!));
        if (!moduleId || !locationId || !eventTypeId || !responsiblePersonId) {
            return;
        }
        startDatesStr = startDatesStr.sort();
        const queryResult = await this.db
            .insert(events)
            .values({
                moduleId,
                startDates: startDatesStr,
                endDate: endDateStr,
                locationId,
                name,
                eventTypeId,
                responsiblePersonId,
                participantsCount,
                links,
            })
            .returning();
        if (queryResult.length > 0) {
            return queryResult[0];
        }
    }

    async deleteMany(ids: string[]) {
        const queryResult = await this.db.delete(events).where(inArray(events.id, ids));
        return { deletedRowCount: queryResult.rowCount ?? 0 };
    }
}
