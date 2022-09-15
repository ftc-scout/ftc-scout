import { MatchScores2020RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Remote";
import { MatchScores2020TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Trad";
import { Season } from "../../ftc-api/types/Season";
import { BaseEntity, Column, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Match } from "./Match";
import { Alliance, allianceFromString } from "./types/Alliance";
import { AutoNavigation2020, autoNavigation2020FromApi } from "./types/2020/AutoNavigation2020";
import { WobbleEndPositions, wobbleEndPositionsFromApi } from "./types/2020/WobbleEndPositions";

//Jonah do what is in the other matchscores ones nexttheyre
