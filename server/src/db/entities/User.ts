import { Field, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Team } from "./Team";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Field(() => Team, { nullable: true })
    @ManyToOne(() => Team, (team) => team.members)
    @TypeormLoader()
    team!: Team | null;

    @Column("int", { nullable: true })
    teamNumber!: number | null;

    @Field()
    @Column({ default: false })
    isVerified!: boolean;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
