import { relations } from "drizzle-orm";
import { boolean, date, integer, pgEnum, pgTable, smallint, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { bytea } from "./bytea";

export const UserRoles = pgEnum("UserRoles", ["USER", "ADMIN"]);

export const users = pgTable("Users", {
    id: uuid().primaryKey().defaultRandom(),
    tgId: integer().unique(),
    name: text().notNull(),
    email: text().unique().notNull(),
    password: text().notNull(),
    profilePic: bytea(),
    role: UserRoles().notNull(),
    isDeleted: boolean().notNull().default(false),
});

export const modules = pgTable("Modules", {
    id: uuid().primaryKey().defaultRandom(),
    number: smallint().notNull(),
    name: text().unique().notNull(),
    isDeleted: boolean().notNull().default(false),
});

export const responsiblePersons = pgTable("ResponsiblePersons", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().unique().notNull(),
    isDeleted: boolean().notNull().default(false),
});

export const eventTypes = pgTable("EventTypes", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().unique().notNull(),
    isDeleted: boolean().notNull().default(false),
});

export const locations = pgTable(
    "Locations",
    {
        id: uuid().primaryKey().defaultRandom(),
        name: text().unique().notNull(),
        isOffline: boolean().notNull(),
        address: text(),
        isDeleted: boolean().notNull().default(false),
    },
    (table) => {
        return [uniqueIndex().on(table.name, table.isOffline)];
    },
);

export const events = pgTable("Events", {
    id: uuid().primaryKey().defaultRandom(),
    moduleId: uuid()
        .references(() => modules.id)
        .notNull(),
    startDates: date().array().notNull(),
    endDate: date(),
    locationId: uuid()
        .references(() => locations.id)
        .notNull(),
    name: text().notNull(),
    eventTypeId: uuid()
        .references(() => eventTypes.id)
        .notNull(),
    responsiblePersonId: uuid()
        .references(() => responsiblePersons.id)
        .notNull(),
    participantsCount: smallint().notNull(),
    links: text().array().notNull(),
});

export const eventsRelations = relations(events, ({ one }) => ({
    module: one(modules, {
        fields: [events.moduleId],
        references: [modules.id],
    }),
    location: one(locations, {
        fields: [events.locationId],
        references: [locations.id],
    }),
    eventType: one(eventTypes, {
        fields: [events.eventTypeId],
        references: [eventTypes.id],
    }),
    responsiblePerson: one(responsiblePersons, {
        fields: [events.responsiblePersonId],
        references: [responsiblePersons.id],
    }),
}));
