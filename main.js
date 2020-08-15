

function generateEnvironment() {

    Particules = [];
    nbParticules = config.particleNb.value;
    config.disableGravity = config.gravity.value === 0;

    const newColor = () => {
        const rdnClr = () => Math.round(255 - (random(0, 255) * config.colors.value));
        return `rgb(${rdnClr()},${rdnClr()},${rdnClr()})`;
    }

    const x = config.horizontalMargin;
    const y = config.verticalMargin;
    const xMax = w - config.horizontalMargin;
    const yMax = h - config.verticalMargin;

    let n = config.particleNb.value;
    let i = 0;
    while (n > 0 || i > 9999) {
        const size = randomize(config.particleSize.value, config.particleSize.min, config.particleSize.max, config.particleSize.randomization);
        const radius = size / 2;
        const P = {
            position: new Vector(random(x, xMax), random(y, yMax)),
            force: new Vector(0, 0),
            speed: 0,
            mass: Math.PI * (radius ** 2) * config.particleDensity.value,
            color: newColor(),
            size,
            radius,
            friends: [],
            collisionChecked: false,
            addSpeed: function (d) {
                this.force = this.force.add(d);
            },
        };

        if (!checkFirstCollisions(P)) {
            Particules.push(P);
            n--;
        } else i++;
    }
    if (i > 9999) alert('infinite loop')

    gravityValue = gravityBaseValue / nbParticules;
    ctx.clearRect(0, 0, w, h)
    draw()
};

function checkFirstCollisions(P1) {
    for (let i2 = 0; i2 < Particules.length; i2++) {
        const P2 = Particules[i2];
        const distance = Math.hypot(P2.position.x - P1.position.x, P2.position.y - P1.position.y);
        const doubleRadius = P1.radius + P2.radius;
        if (distance < doubleRadius && !P1.collisionChecked && !P2.collisionChecked) return true
    }
}

const gravityValueWithoutFading = 1 - config.gravityFadeWithDistance.value * (config.gravity.value / 10);
const getGravityValue = distanceSquared => {
    const withFading = config.gravityFadeWithDistance.value * (1 / distanceSquared);
    return (withFading + gravityValueWithoutFading) * gravityValue;
}


function randomize(expectedValue, min, max, randomizationStrength = 1) {
    if (randomizationStrength > 1) alert('wrong value for randomization strength')
    const minInterval = Math.min(expectedValue - min, max - expectedValue);
    const addRandomnessInRange = (Math.random() - 0.5) * minInterval;
    /// randomisation de minInterval autour de expectedValue
    const randomizedValue = expectedValue + addRandomnessInRange;
    return expectedValue * (1 - randomizationStrength) + randomizedValue * randomizationStrength;
}

generateEnvironment();