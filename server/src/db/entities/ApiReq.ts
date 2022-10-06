import { ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class ApiReq extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("json")
    headers!: JSON;

    @Column("json")
    req!: JSON;

    @CreateDateColumn()
    createdAt!: Date;
}
