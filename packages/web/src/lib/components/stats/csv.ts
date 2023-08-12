import { ExportToCsv } from "export-to-csv";
import type { StatColumn, StatData } from "./stat-table";

export function exportCSV<T>(
    data: StatData<T>[],
    stats: StatColumn<T>[],
    filename: string,
    title: string
) {
    if (stats.length == 0 || data.length == 0) return;

    let json = data.map((d) => {
        let obj: Record<string, string | number> = {};
        for (let stat of stats) {
            let val = stat.getValueDistilled(d);
            obj[stat.id] = val ?? "";
        }
        return obj;
    });

    let exporter = new ExportToCsv({
        filename,
        title,
        showTitle: true,
        showLabels: true,
        useKeysAsHeaders: true,
    });

    exporter.generateCsv(json);
}
