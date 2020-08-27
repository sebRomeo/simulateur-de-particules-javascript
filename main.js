const newRandomColor = () => {
    const rdnClr = () => Math.round(255 - (random(0, 255) * config.colors.value));
    return `rgb(${rdnClr()},${rdnClr()},${rdnClr()})`;
}

const newColorPerQuarter = (pos) => {
    const a = pos.x - (w / 2);
    const b = pos.y - (h / 2);
    if (a < 0 && b < 0) return `rgb(${randomize(100, 255, config.colors.value)},${randomize(50, 120, config.colors.value)},${randomize(50, 120, config.colors.value)})`;
    if (a < 0 && b > 0) return `rgb(${randomize(100, 255, config.colors.value)},${randomize(50, 200, config.colors.value)},0)`;
    if (a > 0 && b < 0) return `rgb(0,${randomize(50, 200, config.colors.value)},${randomize(100, 255, config.colors.value)})`;
    if (a > 0 && b > 0) return `rgb(${randomize(50, 120, config.colors.value)},${randomize(50, 120, config.colors.value)},${randomize(100, 255, config.colors.value)})`;
}

let particleCouples = [];

function generateEnvironment() {

    Particules = [];
    nbParticules = config.particleNb.value;
    config.disableGravity = config.gravity.value === 0;
    config.broadPhaseDistanceMargin = Math.min(config.particleSize.max, config.particleSize.value * 2)
    broadPhaseMaxHorizontalDistance = 0;

    const whRatio = w / h;
    const horizontalMargin = config.margins.value;
    const verticalMargin = config.margins.value / whRatio;
    const x = horizontalMargin;
    const y = verticalMargin;
    const xMax = w - horizontalMargin;
    const yMax = h - verticalMargin;

    let n = config.particleNb.value;
    let i = 0;
    let particleIndex = 0;
    while (n > 0 && i < 9999) {
        const size = randomize(config.particleSize.min, config.particleSize.max, config.particleSize.randomization, config.particleSize.value);
        const position = new Vector(random(x, xMax), random(y, yMax));
        const radius = size / 2;
        const color = config.colorPerQuarter.value ? newColorPerQuarter(position) : newRandomColor();
        const P = {
            i: particleIndex,
            position,
            force: new Vector(0, 0),
            //gravity: new Vector(0, 0),
            speed: 0,
            mass: Math.PI * (radius ** 2) * config.particleDensity.value,
            color,
            size,
            radius,
            friends: [],
            collisionChecked: false,
        };

        if (!doParticleCollideWithOthers(P)) {
            Particules.push(P);
            gravities[particleIndex] = new Vector(0, 0);
            particleIndex++;
            n--;
        } else i++;
    }
    if (i >= 9999) alert('Nombre de particules maximum atteint')

    gravityValue = config.gravity.value / nbParticules;
    gravityValueWithoutFading = 1 - config.gravityFadeWithDistance.value;

    viewPort = new Vector(0, 0)
    lastViewportUpdate = new Vector(0, 0)
    redraw()
    generateParticleCouples();

    gravitiesUpdated = false;
    gravitiesToBeUpdated = gravities;
    particlesUpdated = false;
    particlesToBeUpdated = Particules;

    gravityWorker.postMessage(['registerGlobals', config, particleCouples, gravityValueWithoutFading, gravityValue, Particules.length]);
    collisionWorker.postMessage(['registerGlobals', config, particleCouples, broadPhaseMaxHorizontalDistance, gravityValue, Particules.length]);
};

function doParticleCollideWithOthers(P1) {
    for (let i2 = 0; i2 < Particules.length; i2++) {
        const P2 = Particules[i2];
        const distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
        const doubleRadius = P1.radius + P2.radius;
        if (distance < doubleRadius && !P1.collisionChecked && !P2.collisionChecked) return true
    }
}

const getGravityValue = distanceSquared => {
    const withFading = config.gravityFadeWithDistance.value * (1 / (distanceSquared)) * (10 ** 3);
    return (withFading + gravityValueWithoutFading) * gravityValue;
}

function randomize(min, max, randomizationStrength = 1, expectedValue) {
    if (randomizationStrength > 1) alert('wrong value for randomization strength')
    if (!isset(expectedValue)) expectedValue = min + (max - min) / 2
    const minInterval = Math.min(expectedValue - min, max - expectedValue);
    const addRandomnessInRange = (Math.random() - 0.5) * minInterval;
    /// randomisation de minInterval autour de expectedValue
    const randomizedValue = expectedValue + addRandomnessInRange;
    return expectedValue * (1 - randomizationStrength) + randomizedValue * randomizationStrength;
}

function generateParticleCouples() {
    for (i1 = 0; i1 < nbParticules; i1++) {
        const P1 = Particules[i1];
        checked = i1 + 1;
        for (i2 = checked; i2 < nbParticules; i2++) {
            const P2 = Particules[i2];
            const distanceSquared = Math.pow(P2.position.x - P1.position.x, 2) + Math.pow(P2.position.y - P1.position.y, 2)
            const distance = Math.sqrt(distanceSquared);

            const doubleRadius = P1.radius + P2.radius;
            const maxGravity = getGravityValue((P1.radius + P2.radius) ** 2);
            const totalMass = P1.mass + P2.mass

            broadPhaseMaxHorizontalDistance = Math.max(doubleRadius * 10, broadPhaseMaxHorizontalDistance);

            if (!isset(particleCouples[i1])) particleCouples[i1] = [];
            particleCouples[i1][i2] = {
                P: P2,
                doubleRadius,
                totalMass,
                maxGravity,
                distance,
            }
        }
    }
}

generateEnvironment();