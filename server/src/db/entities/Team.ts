import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { TeamMatchParticipation } from "./TeamMatchParticipation";
import { User } from "./User";

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

    @OneToMany(() => User, (user) => user.team)
    members!: User[];

    @OneToMany(() => TeamMatchParticipation, (tms) => tms.team)
    matches!: TeamMatchParticipation[];

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
