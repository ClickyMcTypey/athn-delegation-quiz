const RESULT_TIERS = [
    {
        min: 0,
        max: 10,
        label: 'Overloaded Operator',
    },
    {
        min: 11,
        max: 20,
        label: 'Emerging Delegator',
    },
    {
        min: 21,
        max: 30,
        label: 'Strategic Delegator',
    },
];

function getTotalScore(answers) {
    return Object.values(answers).reduce((total, answer) => {
        return total + Number(answer.score || 0);
    }, 0);
}

function getResultLabel(totalScore) {
    const result = RESULT_TIERS.find((tier) => {
        return totalScore >= tier.min && totalScore <= tier.max;
    });

    return result?.label || RESULT_TIERS[RESULT_TIERS.length - 1].label;
}

export function calculateQuizResult(state) {
    const totalScore = getTotalScore(state.answers);
    const resultLabel = getResultLabel(totalScore);

    return {
        totalScore,
        resultLabel,
    };
}

export function isFormSlide(slide) {
    return slide?.getAttribute('slide') === 'form';
}

export function updateQuizResult(state) {
    state.result = calculateQuizResult(state);

    console.log('[Delegation Quiz] Result calculated', state.result);

    return state.result;
}