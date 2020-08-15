const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

//const gravitationalConstant = 6.67408 * Math.pow(10, -4);// Math.pow(10, -11);

let w = window.innerWidth
let h = window.innerHeight
canvas.width = w;
canvas.height = h;
window.addEventListener('resize', () => (w = window.innerWidth) && (h = window.innerHeight))

const config = {
    drawInterpolationFrames: false,
    particleNb: { name: `Nombre de particules`, value: 300, min: 2, max: 999, step: 1, randomization: 0.2 },
    //particleSpeed: { name: `Vitesse des particules`, value: 0.5, randomization: 0.2 },
    particleDensity: { name: `Densité des particules (poids)`, value: 0.5 },
    //particlePosition: { name: `Position des particules`, randomization: 0.5 },
    particleSize: { name: `Taille des particules`, value: 3, min: 1, max: 50, step: 1, randomization: 0.5, },
    gravity: { name: `Gravité`, value: 0.5 },
    gravityFadeWithDistance: { name: `Diminution de la gravité avec la distance`, value: 0.2, step: 0.1 },
    restitution: { name: `Rebond`, value: 0.8, min: 0.7, max: 1, step: 0.1 },
    //atmos: { name: `Atmosphere`, value: 1, randomization: 0.2 },
    colors: { name: `Couleurs`, value: 0.5, randomization: 0.2, step: 0.1 },
    horizontalMargin: 150,
    verticalMargin: 150,
    disableCollisions: { name: `Désactiver les collisions`, value: false },
    broadPhaseDistanceMargin: 5, // broadphase friends consideration
};

let Particules = [];
let nbParticules = 0;
let gravityBaseValue = 0.002;
let gravityValue = 0.02;// to be divided by particules nb

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