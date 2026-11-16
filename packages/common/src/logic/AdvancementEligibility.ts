export enum AdvancementEligibility {
    Eligible = "Eligible",
    AlreadyAdvanced = "AlreadyAdvanced",
    WrongRegion = "WrongRegion",
    TooManyEvents = "TooManyEvents",
    MultipleReasons = "MultipleReasons",
}

export function getAdvancementEligibility(
    regionOk: boolean,
    playedCountOk: boolean,
    notPreviouslyAdvanced: boolean
): AdvancementEligibility {
    // FIRST lists teams that already advanced as such, whatever else applies to them.
    if (!notPreviouslyAdvanced) return AdvancementEligibility.AlreadyAdvanced;
    if (!regionOk && !playedCountOk) return AdvancementEligibility.MultipleReasons;
    if (!regionOk) return AdvancementEligibility.WrongRegion;
    if (!playedCountOk) return AdvancementEligibility.TooManyEvents;

    return AdvancementEligibility.Eligible;
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
