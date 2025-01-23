import { Module } from "@nestjs/common";

import { DrizzleModule } from "../drizzle/drizzle.module";

import { EventTypesController } from "./event-types.controller";
import { EventTypesService } from "./event-types.service";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { LocationsController } from "./locations.controller";
import { LocationsService } from "./locations.service";
import { ModulesController } from "./modules.controller";
import { ModulesService } from "./modules.service";
import { ResponsiblePersonsController } from "./responsible-persons.controller";
import { ResponsiblePersonsService } from "./responsible-persons.service";

@Module({
    imports: [DrizzleModule],
    controllers: [
        ModulesController,
        ResponsiblePersonsController,
        EventTypesController,
        LocationsController,
        EventsController,
    ],
    providers: [ModulesService, ResponsiblePersonsService, EventTypesService, LocationsService, EventsService],
})
export class ActivityModule {}
