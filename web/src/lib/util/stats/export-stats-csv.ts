import { distillStatRead, type Stat } from "./Stat";
import { ExportToCsv } from "export-to-csv";

type StatData<T> = {
    rank: number;
    preFilterRank: number;
    data: T;
};

export function exportStatsCSV<T>(eventName: string, data: StatData<T>[], stats: Stat<T>[]) {
    if (stats.length == 0 || data.length == 0) return;

    let jsonData = data.map((d) => {
        let obj: Record<string, number | string> = {};
        stats.forEach((s) => {
            let value = s.read(d);
            value = distillStatRead(value);
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
