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
-   At this point all your data should load correctly when you run the program. Make sure it does.
-   Update the `TeamEventParticipation` graphql union with your new season.
-   Update the various resolvers for `Event`, `Team`, etc.
-   Add a `MatchScores{season}Graphql` type, update the `MatchScoresUnion`, and update the `Match` resolver to return this new type of match score.
-   Update the apollo client on the frontend to support the new backend types.
-   Update the season param to support the new season
-   Update the `FullMatchScores` graphql fragment. Make sure `npm run gen` still works
-   Add score modals for the new season
-   Update the `FullStats` Fragment
-   Add an `EventStats{season}.svelte` file and connect it in in the `EventStats.svelte` file
-   Make sure that all the scores are accurate. (Esp. check that opr is right)
-   Make the backend request for season records.
-   Make a `StatSet{season}`.
-   Add a `TeamSeasonRecords{season}.svelte` for the season and wire it in on the records page.
-   Adjust `DateRange.svelte` for the season