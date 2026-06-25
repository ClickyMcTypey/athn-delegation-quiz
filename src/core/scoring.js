const RESULT_TIERS = [
    {
        min: 0,
        max: 10,
        tier: 'tier_1',
        label: 'Overloaded Operator',
    },
    {
        min: 11,
        max: 20,
        tier: 'tier_2',
        label: 'Emerging Delegator',
    },
    {
        min: 21,
        max: 30,
        tier: 'tier_3',
        label: 'Strategic Delegator',
    },
];

function getTotalScore(answers) {
    return Object.values(answers).reduce((total, answer) => {
        return total + Number(answer.score || 0);
    }, 0);
}

function getMaxScoreFromSlides(slides) {
    return slides.reduce((total, slide) => {
        const radios = Array.from(slide.querySelectorAll('input[type="radio"][data-score]'));

        if (!radios.length) return total;

        const highestScore = radios.reduce((highest, radio) => {
            return Math.max(highest, Number(radio.dataset.score || 0));
        }, 0);

        return total + highestScore;
    }, 0);
}

function getResultTier(totalScore) {
    return (
        RESULT_TIERS.find((result) => {
            return totalScore >= result.min && totalScore <= result.max;
        }) || RESULT_TIERS[RESULT_TIERS.length - 1]
    );
}

export function calculateQuizResult(state) {
    const totalScore = getTotalScore(state.answers);
    const maxScore = getMaxScoreFromSlides(state.slides);
    const result = getResultTier(totalScore);

    return {
        totalScore,
        maxScore,
        resultTier: result.tier,
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