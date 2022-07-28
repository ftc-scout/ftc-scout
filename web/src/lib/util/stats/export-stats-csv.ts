import type { Stat } from "./Stat";
import { ExportToCsv } from "export-to-csv";

export function exportStatsCSV<T>(eventName: string, data: T[], stats: Stat<T>[]) {
    let jsonData = data.map((d) => {
        let obj: Record<string, number> = {};
        stats.forEach((s) => {
            let value = s.read(d);
            value = typeof value == "number" ? value : value.number;
            obj[s.listName] = value;
        });
        return obj;
    });

    const options = {
        showLabels: true,
        filename: `${eventName.replace(" ", "_")}_Data`,
        showTitle: true,
        title: `${eventName} Data`,
        useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(jsonData);
}
