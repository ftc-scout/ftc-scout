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
    if (regionOk && playedCountOk && notPreviouslyAdvanced) {
        return AdvancementEligibility.Eligible;
    }

    if (!regionOk) return AdvancementEligibility.WrongRegion;
    if (!notPreviouslyAdvanced) return AdvancementEligibility.AlreadyAdvanced;

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
