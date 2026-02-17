export enum AdvancementEligibility {
    Eligible = "ELIGIBLE",
    AlreadyAdvanced = "ALREADY_ADVANCED",
    WrongRegion = "WRONG_REGION",
    TooManyEvents = "TOO_MANY_EVENTS",
    MultipleReasons = "MULTIPLE_REASONS",
}

export function getAdvancementEligibility(
    regionOk: boolean,
    playedCountOk: boolean,
    notPreviouslyAdvanced: boolean
): AdvancementEligibility {
    if (regionOk && playedCountOk && notPreviouslyAdvanced) {
        return AdvancementEligibility.Eligible;
    }

    const reasons: AdvancementEligibility[] = [];
    if (!regionOk) return AdvancementEligibility.WrongRegion;
    // if (!regionOk) reasons.push(AdvancementEligibility.WrongRegion);
    if (!notPreviouslyAdvanced) reasons.push(AdvancementEligibility.AlreadyAdvanced);
    // if (!playedCountOk) reasons.push(AdvancementEligibility.TooManyEvents);
    // This is unreliable, better a false ineligibility than a false eligibility

    if (reasons.length === 1) {
        return reasons[0];
    }
    return AdvancementEligibility.MultipleReasons;
}

export function isEligible(eligibility: AdvancementEligibility): boolean {
    return eligibility === AdvancementEligibility.Eligible;
}

export function getEligibilityDisplayText(eligibility: AdvancementEligibility): string {
    switch (eligibility) {
        case AdvancementEligibility.Eligible:
            return "Eligible";
        case AdvancementEligibility.AlreadyAdvanced:
            return "Already Advanced";
        case AdvancementEligibility.WrongRegion:
            return "Wrong Region";
        case AdvancementEligibility.TooManyEvents:
            return "Too Many Events";
        case AdvancementEligibility.MultipleReasons:
            return "Multiple Ineligibility Reasons";
    }
}
