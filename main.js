/* global Matter */

let w = window.innerWidth
let h = window.innerHeight
const gravitationalConstant = 6.67408 * Math.pow(10, -2);// Math.pow(10, -11);

window.addEventListener('resize', () => (w = window.innerWidth) && (h = window.innerHeight))

const { Engine, Render, Runner, Body, Events, Composite, Composites, Common, MouseConstraint, Mouse, World, Bodies, Vector } = Matter;

const config = {
    particleNb: { name: `Nombre de particules`, value: 0.05, randomization: 0.2 },
    particleSpeed: { name: `Vitesse des particules`, value: 0.5, randomization: 0.2 },
    particleWeight: { name: `Poids des particules`, value: 0.5 },
    particlePosition: { name: `Position des particules`, randomization: 0.2 },
    particleSize: { name: `Taille des particules`, value: 0.1, randomization: 0 },
    gravity: { name: `Gravité`, value: 0.5 },
    restitution: { name: `Rebond`, value: 1 },
    atmos: { name: `Atmosphere`, value: 1, randomization: 0.2 },
    colors: { name: `Couleurs`, value: 0.5, randomization: 0.2 },
    collidableBorders: true,
};
// determine la distance a partir de laquelle le calcul de colision est ignoré
config.minDistanceForCollisionDetection = config.particleSize.value * 10;






// create engine
const engine = Engine.create()

// create renderer
var render = Render.create({
    canvas: document.getElementById('scene'),
    engine,
    options: {
        width: w,
        height: h,
        wireframes: true,
        wireframeBackground: 'transparent',
        background: 'transparent',
    }
});
Render.run(render);
var runner = Runner.create({
    // fps: 10,
    // correction: 1,
    // deltaSampleSize: 60,
    // counterTimestamp: 0,
    // frameCounter: 0,
    // deltaHistory: [],
    // timePrev: null,
    // timeScalePrev: 1,
    // frameRequestId: null,
    // isFixed: true,
    // enabled: true
});

const world = engine.world;
world.gravity.y = 0;

const simulation = {
    paused: true,
    play: () => Runner.run(runner, engine),
    pause: () => Runner.stop(runner),
    stepForward: () => Runner.tick(runner, engine),
}

$('#controls-play').click(() => simulation.play());
$('#controls-pause').click(() => simulation.pause());
$('#controls-step-forward').click(() => simulation.stepForward());

function init() {

    const newColor = () => {
        const rdnClr = () => 255 - (random(0, 255) * config.colors.value);
        return { fillStyle: `rgb(${rdnClr()},${rdnClr()},${rdnClr()})` };
    }

    const globalBodiesOptions = {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        restitution: config.restitution.value,
    };

    if (config.collidableBorders) {
        const bodies = [
            // origin is mass center
            Bodies.rectangle(w / 2, 5, w, 10, { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' }, ...globalBodiesOptions }), // top
            Bodies.rectangle(w / 2, h - 5, w, 10, { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' }, ...globalBodiesOptions }), // bottom
            Bodies.rectangle(w - 5, h / 2, 10, h - 20, { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' }, ...globalBodiesOptions }), // right
            Bodies.rectangle(5, h / 2, 10, h - 20, { isStatic: true, render: { fillStyle: 'rgba(0,0,0,0)' }, ...globalBodiesOptions }) // left
        ]
        // scene code
        World.add(world, bodies);
    }

    const particleSize = minMax(config.particleSize.value, 0.1, 1) * 10;

    const whRatio = w / h;
    const nbColumns = config.particleNb.value * 50;
    const nbRows = Math.floor(nbColumns / whRatio);
    const rowGap = ((w - 20) / (nbColumns + 2)) - particleSize;
    const verticalMargin = 300
    const horizontalMargin = 300

    var stack = Composites.stack(horizontalMargin, verticalMargin, nbColumns, nbRows, rowGap, rowGap, function (x, y) {

        const size = randomize(config.particleSize.value, 1, 10, config.particleSize.randomization);
        const density = config.particleWeight.value;
        const x2 = minMax(randomize(0.5, x - rowGap, x + rowGap, config.particlePosition.randomization), 15, w - 15);
        const y2 = minMax(randomize(0.5, y - rowGap, y + rowGap, config.particlePosition.randomization), 15, h - 15);

        return Bodies.circle(x2, y2, size, { size, density, render: newColor(), inertia: Infinity, ...globalBodiesOptions });
    });

    World.add(world, stack);

    // fit the render viewport to the scene
    Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: w, y: h } });

    Events.on(engine, 'beforeUpdate', loop(config));
};



function processColisions() { }

function randomize(value, min, max, randomizationStrength) {
    const expectedValue = value * (max - min) + min;
    const randomizedValue = expectedValue + ((Math.random() - 0.5) * ((max - min) / 2));
    //console.log(Math.round(expectedValue), Math.round(randomizedValue), Math.round(expectedValue * (1 - randomizationStrength) + randomizedValue * randomizationStrength))
    return expectedValue * (1 - randomizationStrength) + randomizedValue * randomizationStrength;
}


init();