import { Season } from "@ftc-scout/common";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class DataHasBeenLoaded extends BaseEntity {
    @PrimaryColumn("int")
    season!: Season;

    @Column({ default: false })
    teams!: boolean;

    @Column({ default: false })
    events!: boolean;

    @Column({ default: false })
    matches!: boolean;

    @Column({ default: false })
    awards!: boolean;

    @Column({ default: false })
    leagues!: boolean;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static async teamsHaveBeenLoaded(season: Season): Promise<boolean> {
        return (await DataHasBeenLoaded.findOneBy({ season }))?.teams ?? false;
    }

    static async eventsHaveBeenLoaded(season: Season): Promise<boolean> {
        return (await DataHasBeenLoaded.findOneBy({ season }))?.events ?? false;
    }

    static async matchesHaveBeenLoaded(season: Season): Promise<boolean> {
        return (await DataHasBeenLoaded.findOneBy({ season }))?.matches ?? false;
    }

    static async awardsHaveBeenLoaded(season: Season): Promise<boolean> {
        return (await DataHasBeenLoaded.findOneBy({ season }))?.awards ?? false;
    }

    static async leaguesHaveBeenLoaded(season: Season): Promise<boolean> {
        return (await DataHasBeenLoaded.findOneBy({ season }))?.leagues ?? false;
    }
}
