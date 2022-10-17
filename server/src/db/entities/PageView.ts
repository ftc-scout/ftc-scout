import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PageView {
    @PrimaryColumn()
    name!: string;

    @Column("int")
    count!: number;
}
