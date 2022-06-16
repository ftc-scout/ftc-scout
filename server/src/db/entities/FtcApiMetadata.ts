import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { Season } from "../../ftc-api/types/Season";

@Entity()
export class FtcApiMetadata extends BaseEntity {
    @PrimaryColumn({ type: "int" })
    season!: Season;

    @Column({ type: "timestamptz", nullable: true })
    lastTeamsReq!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    lastEventsReq!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    lastMatchesReq!: Date | null;

    static async getLastTeamsReq(season: Season): Promise<Date | null> {
        return (
            (await FtcApiMetadata.findOneBy({ season }))?.lastTeamsReq ?? null
        );
    }

    static async getLastEventsReq(season: Season): Promise<Date | null> {
        return (
            (await FtcApiMetadata.findOneBy({ season }))?.lastEventsReq ?? null
        );
    }

    static async getLastMatchesReq(season: Season): Promise<Date | null> {
        return (
            (await FtcApiMetadata.findOneBy({ season }))?.lastMatchesReq ?? null
        );
    }
}
