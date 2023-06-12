import { ColumnTypeStr } from "@ftc-scout/common";
import { ColumnType } from "typeorm";

type InstanceTypeable = abstract new (...args: any) => any;
export type SubtypeClass<Super extends InstanceTypeable, Props> = Super &
    (new () => InstanceType<Super> & Props);

export type StrToColumnType<T extends ColumnTypeStr> = T extends "int"
    ? number
    : T extends "string"
    ? string
    : T extends "bool"
    ? boolean
    : never;

export function getTypeormType(strTy: ColumnTypeStr): ColumnType {
    switch (strTy) {
        case "string":
            return "varchar";
        case "int":
            return "int";
        case "bool":
            return "boolean";
    }
}
