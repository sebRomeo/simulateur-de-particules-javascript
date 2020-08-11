let w = window.innerWidth
let h = window.innerHeight
let nbParticules = 0;
const gravitationalConstant = 6.67408 * Math.pow(10, -4);// Math.pow(10, -11);
const config = {
    particleNb: { name: `Nombre de particules`, value: 0.10, randomization: 0.2 },
    particleSpeed: { name: `Vitesse des particules`, value: 0.5, randomization: 0.2 },
    particleDensity: { name: `Densité des particules`, value: 0.5 },
    particlePosition: { name: `Position des particules`, randomization: 0.2 },
    particleSize: { name: `Taille des particules`, value: 0.5, randomization: 0 },
    gravity: { name: `Gravité`, value: 0.5 },
    restitution: { name: `Rebond`, value: 1 },
    atmos: { name: `Atmosphere`, value: 1, randomization: 0.2 },
    colors: { name: `Couleurs`, value: 0.5, randomization: 0.2 },
    collidableBorders: false,
};
config.disableGravity = config.gravity.value === 0;