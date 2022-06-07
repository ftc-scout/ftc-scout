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

    @Field(() => String)
    @Column()
    schoolName?: string;

    @Field(() => String)
    @Column()
    country?: string;

    @Field(() => String)
    @Column()
    stateOrProvince?: string;

    @Field(() => String)
    @Column()
    city?: string;

    @Field(() => Int)
    @Column({ type: "int" })
    rookieYear?: number;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    website?: string;
}
