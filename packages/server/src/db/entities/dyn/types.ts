import { ColumnTypeStr } from "@ftc-scout/common";
import { ColumnType } from "typeorm";

type InstanceTypeable = abstract new (...args: any) => any;
export type SubtypeClass<Super extends InstanceTypeable, Props> = Super &
    (new () => InstanceType<Super> & Props);

export function getTypeormType(strTy: ColumnTypeStr): ColumnType {
    switch (strTy) {
        case "string":
            return "varchar";
        case "int8":
        case "int16":
            return "smallint";
        case "bool":
            return "boolean";
    }
}
