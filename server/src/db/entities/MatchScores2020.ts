import { BaseEntity, Column, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Season } from "../../ftc-api/types/Season";
import { Match } from "./Match";
import { Alliance, allianceFromString } from "./types/Alliance";
import { MatchScores2020RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Remote";
import { MatchScores2020TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Trad";
