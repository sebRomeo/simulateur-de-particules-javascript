const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

//const gravitationalConstant = 6.67408 * Math.pow(10, -4);// Math.pow(10, -11);

let w = window.innerWidth
let h = window.innerHeight
canvas.width = w;
canvas.height = h;
window.addEventListener('resize', () => (w = window.innerWidth) && (h = window.innerHeight))
let viewPort = new Vector(0, 0);
let lastViewportUpdate;
let zoom = 1;

const defaults = {
    drawInterpolationFrames: false,
    particleNb: { name: `Nombre de particules`, value: 999, min: 2, max: 999, step: 1, randomization: 0.2 },
    particleDensity: { name: `Densité des particules (poids)`, value: 0.5 },
    particleSize: { name: `Taille des particules`, value: 4, min: 1, max: 50, step: 1, randomization: 0.5, },
    gravity: { name: `Gravité`, value: 0.08, min: 0.0002, max: 0.02, },
    gravityFadeWithDistance: { name: `Diminution de la gravité avec la distance`, value: 0.5, step: 0.1 },
    restitution: { name: `Rebond`, value: 0.9, min: 0.5, max: 1, step: 0.01 },
    colors: { name: `Couleurs`, value: 0.5, randomization: 0.2, step: 0.1 },
    margins: { name: `Marges`, value: 100, min: 0, max: 300, step: 0.1 },
    disableCollisions: { name: `Désactiver les collisions`, value: false },
    colorPerQuarter: { name: `Couleurs par quartiers`, value: true },
    broadPhaseDistanceMargin: 5, // will be auto calculated based on particle size
};

const preset1 = {
    particleNb: 50,
    particleSize: 6,
    gravityFadeWithDistance: 1,
    restitution: 0,
}

const preset2 = {
    particleNb: 25,
    particleSize: 12,
    gravityFadeWithDistance: 0.5,
    restitution: 0.9,
}

let config = buildConfig(preset2);

let Particules = [];
let nbParticules = 0;
let gravityValue = 0.002;// to be divided by particules nb

const simulation = {
    paused: true,
    play: () => {
        if (!simulation.paused) return;
        simulation.paused = false;
        loop();
    },
    pause: () => simulation.paused = true,
    toggle: () => simulation.paused ? simulation.play() : simulation.pause(),
    stepForward: () => {
        simulation.paused = true;
        loop()
    },
}


let gravityValueWithoutFading = 1 - config.gravityFadeWithDistance.value;


function buildConfig(preset) {
    const newPreset = { ...defaults };
    for (const paramName in newPreset) if (isset(preset[paramName])) newPreset[paramName].value = preset[paramName];
    return newPreset;
}