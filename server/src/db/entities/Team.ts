import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Team extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn()
    number!: number;

    @Field()
    @Column()
    name!: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    schoolName?: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    country?: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    stateOrProvince?: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    city?: string;

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
    rookieYear?: number;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    website?: string;
}
