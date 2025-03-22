import { Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "../drizzle/drizzle.schema";
import { events, responsiblePersons } from "../drizzle/drizzle.schema";

import { BaseReferencesService } from "./base-references.service";

@Injectable()
export class ResponsiblePersonsService extends BaseReferencesService {
    constructor(db: NodePgDatabase<typeof schema>) {
        super(db, responsiblePersons, events.responsiblePersonId);
    }
}
