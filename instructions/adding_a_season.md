# Adding a New Season (Advancement & Leagues Info Only)

> [!NOTE]
> TODO, add info on how to create a season descriptor and add api types.
> For now, use previous seasons as a reference. [2025/2026 Decode](https://github.com/ftc-scout/ftc-scout/pull/26)

---

## Leagues

Nothing season-specific is required. The `league_ranking_20XY` table is created automatically from the season's Descriptor.

---

## Advancement

Advancement points are season-specific, each season defines its own point values and tiebreak order. You need to create a new config for the new season and register it in `points-list.ts`.:

### 1. Create the config: `packages/common/src/logic/advancement/seasons/[GameName]AdvancementConfig.ts`

You can copy `DecodeAdvancementConfig.ts` to get started or use the template below. You will need to fill in the values for your season.

The things that typically change season to season:

-   `tieBreakKeys`: ordered list of tiebreakers; check the season manual

Other values that may change:

-   `PLAYOFF_POINTS`: points per playoff placement
-   `DIVISION_PLAYOFF_POINTS`: points per placement inside a division playoff excluding the division champion (because the division champion plays in the parent event playoff, so uses PLAYOFF_POINTS)
-   `INSPIRE_POINTS` / `OTHER_AWARD_POINTS`: points per award placement
-   `ADVANCEMENT_JUDGED_AWARD_TYPES`: which award types count toward advancement
-   `calculateQualPoints`: the formula mapping rank + team count to qualification points
-   `calculateAllianceSelectionPoints`: calculate the points for alliance selection based on the position of the team in the alliance selection order
-   `maxQualEvents`: teams may only be eligible to advance from the first `maxQualEvents` events they attend

Required exports:

```ts
export const [GameName]AdvancementConfig: AdvancementPointsConfig = {
    season: Season.[GameName],
    tieBreakKeys: [...],
    calculateQualPoints: (rank, teamCount) => ...,
    calculateAllianceSelectionPoints: (position) => ...,
    getPlayoffPoints: (placement) => PLAYOFF_POINTS[placement] ?? 0,
    getDivisionPlayoffPoints: (placement) => DIVISION_PLAYOFF_POINTS[placement] ?? 0,
    getAwardPoints: (awardType, placement) => ...,
    maxQualEvents: 3,
};
```

### 2. Register it: `packages/common/src/logic/advancement/points-list.ts`

```ts
import { [GameName]AdvancementConfig } from "./seasons/[GameName]AdvancementConfig";

export const ADVANCEMENT_CONFIGS: Partial<Record<Season, AdvancementPointsConfig>> = {
    [Season.[GameName]]: [GameName]AdvancementConfig,
    [Season.Decode]: DecodeAdvancementConfig,
};
```
