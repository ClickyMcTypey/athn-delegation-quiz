const RESULT_TIERS = [
    {
        min: 10,
        max: 16,
        key: 'beginner',
        label: 'Beginner',
    },
    {
        min: 17,
        max: 22,
        key: 'novice',
        label: 'Novice',
    },
    {
        min: 23,
        max: 28,
        key: 'intermediate',
        label: 'Intermediate',
    },
    {
        min: 29,
        max: 33,
        key: 'advanced',
        label: 'Advanced',
    },
    {
        min: 34,
        max: 37,
        key: 'expert',
        label: 'Expert',
    },
    {
        min: 38,
        max: 40,
        key: 'mastery',
        label: 'Mastery',
    },
];

function getTotalScore(answers) {
    return Object.values(answers).reduce((total, answer) => {
        return total + Number(answer.score || 0);
    }, 0);
}

function getResult(totalScore) {
    return (
        RESULT_TIERS.find((tier) => {
            return totalScore >= tier.min && totalScore <= tier.max;
        }) || RESULT_TIERS[RESULT_TIERS.length - 1]
    );
}

export function calculateQuizResult(state) {
    const totalScore = getTotalScore(state.answers);
    const result = getResult(totalScore);

    return {
        totalScore,
        resultKey: result.key,
        resultLabel: result.label,
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