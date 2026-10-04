export type ApiBiobuzzScoringElement = "RED_NECTAR" | "BLUE_NECTAR" | "POLLEN";

export interface AllianceScores2026TradFtcApi {
    alliance: "Blue" | "Red";
    team: number;

    autoRobot1Leave: boolean;
    autoRobot2Leave: boolean;
    autoRobot1Park: boolean;
    autoRobot2Park: boolean;
    autoHiveTips: number;
    autoLeavePoints: number;
    autoParkPoints: number;
    autoHivePoints: number;
    autoPoints: number;

    teleopHiveTips: number;
    teleopHivePollenNectar: number;
    redAllianceFlower: ApiBiobuzzScoringElement[];
    blueAllianceFlower: ApiBiobuzzScoringElement[];
    scoringFlower: ApiBiobuzzScoringElement[];
    audienceFlower: ApiBiobuzzScoringElement[];
    teleopGardenPollenNectar: number;
    teleopRobot1Park: boolean;
    teleopRobot2Park: boolean;
    teleopHivePoints: number;
    teleopFlowerPoints: number;
    teleopGardenPoints: number;
    teleopParkPoints: number;
    teleopPoints: number;

    majorFouls: number;
    minorFouls: number;
    foulPointsCommitted: number;
    preFoulTotal: number;

    totalPoints: number;

    swarmRP: boolean;
    pollinator1RP: boolean;
    pollinator2RP: boolean;
}
