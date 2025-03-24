import { Injectable } from "@nestjs/common";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";

import { EventsService } from "./events.service";
import { ModulesService } from "./modules.service";

const TEMPLATE_PATH = path.resolve(__dirname, "assets/report-template.docx");
const TEMPLATE_CONTENT = fs.readFileSync(TEMPLATE_PATH, "binary");
const MONTHS: string[] = [];
for (let month = 0, date = new Date(); month < 12; ++month) {
    date.setMonth(month);
    MONTHS.push(date.toLocaleString("ru-RU", { month: "long" }));
}

@Injectable()
export class ReportsService {
    private readonly zip: PizZip;

    constructor(
        private readonly eventsService: EventsService,
        private readonly modulesService: ModulesService,
    ) {
        this.zip = new PizZip(TEMPLATE_CONTENT);
    }

    private getDoc() {
        return new Docxtemplater(this.zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
    }

    private static numPadStart2(num: number) {
        return num.toString().padStart(2, "0");
    }

    private static getDates(startDates: Date[], endDate: Date | null) {
        let dates = startDates
            .map((date) => `${this.numPadStart2(date.getDate())}.${this.numPadStart2(date.getMonth() + 1)}`)
            .join(", ");
        if (endDate) {
            dates += ` — ${this.numPadStart2(endDate.getDate())}.${this.numPadStart2(endDate.getMonth() + 1)}`;
        }
        return dates;
    }

    private static getVenue(name: string, address: string | null) {
        let venue = name;
        if (address) {
            venue += `\n(${address})`;
        }
        return venue;
    }

    private static mapParticipantsCount(participantsCount: number) {
        switch (participantsCount) {
            case -1:
                return "Все желающие вуза";
            case 0:
                return "Все желающие факультета";
            default:
                return participantsCount;
        }
    }

    private async mapModulesAndEvents(startDate: Date, endDate: Date) {
        const events = await this.eventsService.findAll(startDate, endDate);
        const modules = await this.modulesService.search();
        const modulesWithRows: Record<string, { module: string; rows: Record<string, string | number>[] }> = {};
        modules.forEach(
            ({ id, name }, index) => (modulesWithRows[id] = { module: `Модуль ${index + 1}. ${name}`, rows: [] }),
        );
        events.forEach((event) => {
            modulesWithRows[event.moduleId].rows.push({
                dates: ReportsService.getDates(
                    event.startDates.map((date) => new Date(date)),
                    event.endDate ? new Date(event.endDate) : null,
                ),
                venue: ReportsService.getVenue(event.location.name, event.location.address),
                isOffline: event.location.isOffline ? "Очно" : "Онлайн",
                name: event.name,
                eventType: event.eventType.name,
                responsiblePerson: event.responsiblePerson.name,
                participantsCount: ReportsService.mapParticipantsCount(event.participantsCount),
                links: event.links.join(", "),
            });
        });
        const emptyRow = new Proxy(
            {},
            {
                get() {
                    return "";
                },
            },
        );
        return Object.values(modulesWithRows).map((moduleWithRows) => {
            if (moduleWithRows.rows.length === 0) {
                moduleWithRows.rows.push(emptyRow);
            }
            return moduleWithRows;
        });
    }

    async genReport(year: number, month: number) {
        const doc = this.getDoc();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const modulesToRender = await this.mapModulesAndEvents(startDate, endDate);
        await doc.renderAsync({
            year,
            month: MONTHS[month - 1],
            modules: modulesToRender,
        });
        return doc.getZip().generate({ type: "nodebuffer" });
    }
}
