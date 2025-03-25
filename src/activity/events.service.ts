import { Inject, Injectable } from "@nestjs/common";
import { eq, inArray, sql } from "drizzle-orm";
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
                sql`${events.startDates}[1] BETWEEN `,
                sql.raw(`'${startDate.toISOString()}' AND '${endDate.toISOString()}' `),
                sql`AND (${events.endDate} IS NULL OR ${events.endDate} <= `,
                sql.raw(`'${endDate.toISOString()}')`),
            ]),
        });
    }

    async insert({
        module,
        startDates,
        endDate,
        location,
        name,
        eventType,
        responsiblePerson,
        participantsCount,
        links,
    }: {
        module: { id?: string; name?: string };
        startDates: Date[];
        endDate?: Date | null;
        location: { id?: string; data?: { name: string; isOffline: boolean; address?: string | null } };
        name: string;
        eventType: { id?: string; name?: string };
        responsiblePerson: { id?: string; name?: string };
        participantsCount: number;
        links: string[];
    }) {
        const moduleId = module.id ?? (await this.modulesService.getIdByName(module.name!));
        const responsiblePersonId =
            responsiblePerson.id ?? (await this.responsiblePersonsService.getIdByName(responsiblePerson.name!));
        const locationId =
            location.id ??
            (await this.locationsService.getIdByName(location.data!.name)) ??
            (await this.locationsService.insert(location.data!.name, location.data!.isOffline, location.data!.address))
                .insertedOrRestored?.id;
        const eventTypeId =
            eventType.id ??
            (await this.eventTypesService.getIdByName(eventType.name!)) ??
            (await this.eventTypesService.insert(eventType.name!)).insertedOrRestored?.id;
        if (!moduleId || !locationId || !eventTypeId || !responsiblePersonId) {
            throw new Error("Some of required fields are undefined");
        }

        startDates = startDates.sort((a, b) => a.getTime() - b.getTime());
        const startDatesStr = startDates.map((date) => date.toDateString());
        const endDateStr = endDate?.toDateString();

        const queryResults = await this.db
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
        if (queryResults.length > 0) {
            return { insertedOrRestored: queryResults[0] };
        }
        return { insertedOrRestored: null };
    }

    async updateOne(
        id: string,
        {
            module,
            startDates,
            endDate,
            location,
            name,
            eventType,
            responsiblePerson,
            participantsCount,
            links,
        }: {
            module?: {
                id?: string;
                name?: string;
            };
            startDates?: Date[];
            endDate?: Date | null;
            location?: {
                id?: string;
                data?: { name: string; isOffline: boolean; address?: string | null };
            };
            name?: string;
            eventType?: {
                id?: string;
                name?: string;
            };
            responsiblePerson?: {
                id?: string;
                name?: string;
            };
            participantsCount?: number;
            links?: string[];
        },
    ) {
        const moduleId = module ? (module.id ?? (await this.modulesService.getIdByName(module.name!))) : undefined;
        const responsiblePersonId = responsiblePerson
            ? (responsiblePerson.id ?? (await this.responsiblePersonsService.getIdByName(responsiblePerson.name!)))
            : undefined;
        const locationId = location
            ? (location.id ??
              (await this.locationsService.getIdByName(location.data!.name)) ??
              (
                  await this.locationsService.insert(
                      location.data!.name,
                      location.data!.isOffline,
                      location.data!.address,
                  )
              ).insertedOrRestored?.id)
            : undefined;
        const eventTypeId = eventType
            ? (eventType.id ??
              (await this.eventTypesService.getIdByName(eventType.name!)) ??
              (await this.eventTypesService.insert(eventType.name!)).insertedOrRestored?.id)
            : undefined;

        startDates = startDates?.sort((a, b) => a.getTime() - b.getTime());
        const startDatesStr = startDates?.map((date) => date.toDateString());
        const endDateStr = endDate === undefined ? undefined : endDate === null ? null : endDate.toDateString();

        const updateValues = {
            ...(moduleId !== undefined && { moduleId }),
            ...(startDates !== undefined && { startDates: startDatesStr }),
            ...(endDate !== undefined && { endDate: endDateStr }),
            ...(locationId !== undefined && { locationId }),
            ...(name !== undefined && { name }),
            ...(eventTypeId !== undefined && { eventTypeId }),
            ...(responsiblePersonId !== undefined && { responsiblePersonId }),
            ...(participantsCount !== undefined && { participantsCount }),
            ...(links !== undefined && { links }),
        };

        const queryResults = await this.db.update(events).set(updateValues).where(eq(events.id, id)).returning();
        if (queryResults.length > 0) {
            return { updated: queryResults[0] };
        }
        return { updated: null };
    }

    async deleteMany(ids: string[]) {
        const queryResults = await this.db.delete(events).where(inArray(events.id, ids));
        return { deletedRowCount: queryResults.rowCount ?? 0 };
    }
}
