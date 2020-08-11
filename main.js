window.addEventListener('resize', () => (w = window.innerWidth) && (h = window.innerHeight))

const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
canvas.width = w;
canvas.height = h;


const simulation = {
    paused: true,
    play: () => {
        simulation.paused = false;
        loop();
    },
    pause: () => simulation.paused = true,
    stepForward: () => loop(),
}

$('#controls-play').click(() => simulation.play());
$('#controls-pause').click(() => simulation.pause());
$('#controls-step-forward').click(() => simulation.stepForward());

const Particules = [];

function init() {

    const newColor = () => {
        const rdnClr = () => Math.round(255 - (random(0, 255) * config.colors.value));
        return `rgb(${rdnClr()},${rdnClr()},${rdnClr()})`;
    }

    const averageParticleSize = minMax(config.particleSize.value, 0.1, 1) * 10;

    const whRatio = w / h;
    const horizontalMargin = 150;
    const verticalMargin = horizontalMargin / whRatio;
    const nbColumns = Math.floor(config.particleNb.value * 50);
    const nbRows = Math.max(Math.floor(nbColumns / whRatio), 1);
    const horizontalGap = (w - horizontalMargin - (nbColumns * averageParticleSize)) / ((nbColumns - 1) || 1)
    const verticalGap = (h - verticalMargin - (nbRows * averageParticleSize)) / ((nbRows - 1) || 1)

    for (let x = horizontalMargin; x < w - horizontalMargin; x += horizontalGap) {
        for (let y = verticalMargin; y < h - verticalMargin; y += verticalGap) {
            const size = randomize(config.particleSize.value, 1, 10, config.particleSize.randomization);
            const radius = size / 2;
            nbParticules++;
            Particules.push({
                position: {
                    x: randomize(0.5, x - horizontalGap, x + horizontalGap, config.particlePosition.randomization),
                    y: randomize(0.5, y - verticalGap, y + verticalGap, config.particlePosition.randomization),
                },
                force: {
                    x: 0,
                    y: 0,
                },
                mass: Math.PI * (radius ** 2) * config.particleDensity.value,
                color: newColor(),
                size,
                radius,
                collisionChecked: false,
            });
        }
    }

    stats.registerEvents();
};



function randomize(value, min, max, randomizationStrength) {
    const expectedValue = value * (max - min) + min;
    const randomizedValue = expectedValue + ((Math.random() - 0.5) * ((max - min) / 2));
    //console.log(Math.round(expectedValue), Math.round(randomizedValue), Math.round(expectedValue * (1 - randomizationStrength) + randomizedValue * randomizationStrength))
    return expectedValue * (1 - randomizationStrength) + randomizedValue * randomizationStrength;
}

