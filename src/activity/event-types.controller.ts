import { Controller } from "@nestjs/common";

import { BaseReferencesController } from "./base-references.controller";
import { EventTypesService } from "./event-types.service";

@Controller("event-types")
export class EventTypesController extends BaseReferencesController<EventTypesService> {
    constructor(protected service: EventTypesService) {
        super(service);
    }
}
