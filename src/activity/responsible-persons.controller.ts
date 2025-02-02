import { Controller } from "@nestjs/common";

import { BaseReferencesController } from "./base-references.controller";
import { ResponsiblePersonsService } from "./responsible-persons.service";

@Controller("responsible-persons")
export class ResponsiblePersonsController extends BaseReferencesController<ResponsiblePersonsService> {
    constructor(protected service: ResponsiblePersonsService) {
        super(service);
    }
}
