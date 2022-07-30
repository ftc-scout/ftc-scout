import { registerEnumType } from "type-graphql";

export enum Order {
    ASC,
    DESC,
}

registerEnumType(Order, {
    name: "Order",
});
