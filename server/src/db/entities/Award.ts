import { Field, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import {
    BaseEntity,
    Column,
    DeepPartial,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { AwardFtcApi } from "../../ftc-api/types/Award";
import { Season } from "../../ftc-api/types/Season";
import { TeamEventParticipation } from "./TeamEventParticipation";
import {
    Award2021,
    awardCode2021FromFtcApi,
    AwardTypes2021,
} from "./types/2021/Award2021";

@ObjectType()
@Entity()
export class Award extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn()
    season!: Season;

    @Field()
    @PrimaryColumn()
    eventCode!: string;

    @Field(() => Int)
    @PrimaryColumn()
    awardCode!: Award2021;

    @Field(() => Int)
    @PrimaryColumn("int")
    teamNumber!: number;

    @Field(() => TeamEventParticipation)
    @ManyToOne(() => TeamEventParticipation, (tep) => tep.awards)
    @JoinColumn([
        { name: "season", referencedColumnName: "eventSeason" },
        { name: "eventCode", referencedColumnName: "eventCode" },
        { name: "teamNumber", referencedColumnName: "teamNumber" },
    ])
    @TypeormLoader()
    teamEventParticipation!: TeamEventParticipation;

    @Field(() => String, { nullable: true })
    @Column("varchar", { nullable: true })
    personName!: string | null;

    @Field(() => AwardTypes2021)
    type(): AwardTypes2021 {
        return this.awardCode - (this.awardCode % 100);
    }

    @Field(() => Int)
    placement(): number {
        return this.awardCode % 100;
    }

    static fromApi(season: Season, api: AwardFtcApi): Award | null {
        if (api.teamNumber == null) {
            return null;
        }

        let awardCode = awardCode2021FromFtcApi(api);
        if (awardCode) {
            return Award.create({
                season,
                eventCode: api.eventCode,
                awardCode,
                teamNumber: api.teamNumber,
                personName: api.person,
            } as DeepPartial<Award>);
        } else {
            return null;
        }
    }
}
