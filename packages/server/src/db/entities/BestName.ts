import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Team } from "./Team";

@Entity()
export class BestName extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    team1!: number;

    team1D!: Team;

    @Column()
    team2!: number;

    team2D!: Team;

    @Column({ default: -1 })
    vote!: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
