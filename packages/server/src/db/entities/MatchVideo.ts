import { Season } from "@ftc-scout/common";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Match } from "./Match";
import { User } from "./User";

@Entity()
export class MatchVideo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("smallint")
    eventSeason!: Season;

    @Column()
    eventCode!: string;

    @Column("int")
    matchId!: number;

    @ManyToOne(() => Match)
    match!: Match;

    @Column()
    youtubeUrl!: string;

    @Column("int")
    startTime!: number; // in seconds

    @Column("int")
    endTime!: number; // in seconds

    @Column("int")
    createdByUserId!: number;

    @ManyToOne(() => User)
    createdBy!: User;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
