import { Field, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { TeamMatchParticipation } from "./TeamMatchParticipation";
import { User } from "./User";

@ObjectType()
@Entity()
export class Team extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn("int")
    number!: number;

    @Field()
    @Column()
    name!: string;

    @Field(() => String)
    @Column()
    schoolName?: string;

    @Field(() => [String])
    @Column("varchar", { array: true, default: [] })
    sponsors!: string[];

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

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.team)
    @TypeormLoader()
    members!: User[];

    @Field(() => [TeamMatchParticipation])
    @OneToMany(() => TeamMatchParticipation, (tmp) => tmp.team)
    matches!: TeamMatchParticipation[];

    // @Field(() => [TeamEventParticipation2021])
    // @OneToMany(() => TeamEventParticipation2021, (tep) => tep.team)
    // @TypeormLoader()
    // events2021!: TeamEventParticipation2021[];

    // @Field(() => [TeamEventParticipation2019])
    // @OneToMany(() => TeamEventParticipation2019, (tep) => tep.team)
    // @TypeormLoader()
    // events2019!: TeamEventParticipation2021[];

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
