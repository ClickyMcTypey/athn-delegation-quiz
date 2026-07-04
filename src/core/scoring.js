const RESULT_TIERS = [
    {
        min: 10,
        max: 16,
        label: 'Beginner',
    },
    {
        min: 17,
        max: 22,
        label: 'Novice',
    },
    {
        min: 23,
        max: 28,
        label: 'Intermediate',
    },
    {
        min: 29,
        max: 33,
        label: 'Advanced',
    },
    {
        min: 34,
        max: 37,
        label: 'Expert',
    },
    {
        min: 38,
        max: 40,
        label: 'Mastery',
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