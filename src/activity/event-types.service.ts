import { Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/schema";
import { eventTypes, events } from "../drizzle/schema";

import { BaseReferencesService } from "./base-references.service";

@Injectable()
export class EventTypesService extends BaseReferencesService {
    constructor(db: NodePgDatabase<typeof schema>) {
        super(db, eventTypes, events.eventTypeId);
    }
}
