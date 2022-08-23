# How to Add a New Season

-   Update the `CURRENT_SEASON` and `PAST_SEASON` constants in `server/src/constants.ts`
-   Update the `MatchScoresFtcApi` type with the match scores for the season.
-   Make a `MatchScores{season}` DB type (make sure to add a from `ftcApi` method)
-   Add a `scores{season}` field to the `Match` DB type. (Make sure to update `redTotalPoints`, `blueTotalPoints`, and `soloPoints` methods).
-   Update the code that saves all the entities in `loadAllMatches` to include the new season.
    -   Around line ~70 saving each type of score
    -   Around line ~150 converting api scores to db scores.
-   Create new `TeamEventParticipation{season}` and `TepStats{season}` entities for the DB.
-   Implement the `calculateEventStatistics{season}` function and add it to the `loadAllMatches` function (around line ~170).
